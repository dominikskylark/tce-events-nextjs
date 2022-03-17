import React from "react";
import Pusher from "pusher-js";
import styles from "../styles/Chat.module.css";
import { AppContext, getStaticProps } from "../pages/_app";

import { Paperclip, Send } from "react-feather";
import { UserInfo } from "../pages/lobby";

import { config } from "../config";

export default ({ type, passedId }) => {
  const eventOptions = React.useContext(AppContext);
  const userDetails = React.useContext(UserInfo);
  const [newMessage, setNewMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [whoIsOnline, setWhoIsOnline] = React.useState([]);
  //Components
  const SingleMessage = ({ message }) => {
    const properTime = new Date(message.time);
    return (
      <div
        className={
          "row d-flex " +
          (message.who === userDetails.id
            ? "justify-content-end"
            : "justify-content-start")
        }
      >
        <div
          className={
            "mt-3 message p-3 " +
            (message.who === userDetails.id
              ? "user-message"
              : "helpdesk-message")
          }
        >
          {message.content}
          <div
            className={
              "d-flex justify-content-between mt-1 " + styles["message-data"]
            }
            style={{ width: "100%" }}
          >
            {/* <Switch>
              <span when={message.who === state.theme.userDetails.id}>You</span>
              <span when={message.name}>{message.name}</span>
              <span>Helpdesk</span>
            </Switch> */}
            <span>{properTime.toLocaleString()}</span>
          </div>
        </div>
        <style jsx>
          {`
            .message {
              border-radius: 15px;
              color: white;
              width: 75%;
            }
            .user-message {
              background-color: ${eventOptions.options.primary_button_colour};
              color: ${eventOptions.options.primary_button_text_colour};
            }
            .helpdesk-message {
              background-color: ${eventOptions.options.secondary_button_colour};
              color: ${eventOptions.secondary_button_text_colour};
            }

            .message-data {
              font-size: 0.7rem;
            }
          `}
        </style>
      </div>
    );
  };
  const AlwaysScrollToBottom = () => {
    const elementRef = React.useRef();
    React.useEffect(() =>
      elementRef.current.scrollIntoView({ behaviour: "smooth" })
    );
    return <div ref={elementRef} />;
  };
  //Functions
  const handleNewMessage = async (e) => {
    e.preventDefault();
    if (newMessage) {
      let result = await fetch("./api/pusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel: `presence-${eventOptions.code}-${type}-${passedId}`,
          action: "message",
          payload: {
            content: newMessage,
            who: userDetails.id,
            time: Date.now(),
            name: userDetails.details.first_name,
          },
        }),
      });
      if (result.ok) {
        let felka = await result.json();
        console.log(felka);
      }
      setNewMessage("");
    }
  };
  React.useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher("8fd548bef3f79484a0ae", {
      cluster: "eu",
      authEndpoint: "./api/pusher/auth",
      auth: {
        params: {
          username: userDetails.details.first_name,
          photo: "all",
          user_id: userDetails.id,
        },
      },
    });

    const channel = pusher.subscribe(
      `presence-${eventOptions.code}-${type}-${passedId}`
      // "presence-" + state.theme.event_uid + "-" + type + "-" + passedId
    );
    channel.bind("pusher:subscription_succeeded", (members) => {
      // setUsersOnline(members.count);
      // console.log(members);
      // const all = [];
      // for (const prop in members.members) {
      //   all.push({
      //     username: members.members[prop].username,
      //     photo: members.members[prop].photo,
      //   });
      // }
      // console.log("When user logs in", all);
      // setWhoIsOnline(all);
      // console.log(whoIsOnline);
    });

    channel.bind("pusher:member_added", async function (member) {
      // setUsersOnline(channel.members.count);
      // // setWhoIsOnline((prevState) => [
      // //   ...prevState,
      // //   { username: member.info.username, photo: member.info.photo },
      // // ]);
      // let all = whoIsOnline;
      // all.push({
      //   username: member.info.username,
      //   photo: member.info.photo,
      // });
      // console.log("all", all);
      // setWhoIsOnline(all);
      // console.log("whoonline", whoIsOnline);
    });

    channel.bind("pusher:member_removed", (member) => {
      // setUsersOnline(channel.members.count);
      // let all = whoIsOnline;
      // all.find((user) => user.id);
    });
    channel.bind("message", async function (data) {
      console.log(data);
      setMessages((messages) => [...messages, data.payload]);
    });
    console.log("state messages", messages);
  }, []);

  return (
    <div
      className="animate__animated animate__fadeIn"
      style={{ borderRadius: "25px" }}
    >
      <div
        className="col-xs-12 p-4 dark-bg-user"
        style={{
          overflow: "scroll",
          maxHeight: "400px",
          backgroundColor: eventOptions.options.primary_colour,
        }}
        id="chatWindow"
      >
        {passedId + "-" + type}
        {messages.length > 0
          ? messages.map((message) => {
              return (
                <>
                  <SingleMessage message={message} />
                  <AlwaysScrollToBottom />
                </>
              );
            })
          : "No messages yet"}
      </div>
      <div className="col-12 input-window p-3 " style={{}}>
        <form
          onSubmit={handleNewMessage}
          className="d-flex justify-content-evenly align-items-center"
        >
          <div className="btn m-2 button-primary">
            <Paperclip />
          </div>
          <input
            className="p-3"
            style={{
              borderRadius: "25px",
              paddingLeft: "30px",
              border: "2px",
              width: "80%",
              fontSize: 15,
            }}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="btn m-2 button-primary" type="submit">
            <Send />
          </button>
        </form>
        {/* <p className="mt-2" style={{ color: "white" }}>
            {usersOnline < 2
              ? "You're alone in the chat"
              : `Users online: ${usersOnline}`}
          </p> */}
        {whoIsOnline.length > 1
          ? whoIsOnline.map((who) => {
              return (
                <img
                  src={who.photo}
                  style={{ maxWidth: "50px", maxHeight: "50px" }}
                  className="user-photo m-1 mt-2"
                />
              );
            })
          : null}
      </div>
      <style jsx>
        {`
          .input-window {
            background-color: ${eventOptions.options.secondary_colour};
          }
        `}
      </style>
    </div>
  );
};
