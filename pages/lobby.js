import { config } from "../config/index";
import { withIronSessionSsr } from "iron-session/next";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import React from "react";
import { AppContext, UserLocation } from "./_app";
import Pusher from "pusher-js";

export const UserInfo = React.createContext();

export default function Lobby(props) {
  const [userDetails, setUserDetails] = React.useState(props.user);
  const userLocation = React.useContext(UserLocation);
  const eventOptions = React.useContext(AppContext);
  const userDetailsAndId = {
    id: props.userId,
    details: userDetails,
  };

  React.useEffect(() => {
    const pusher = new Pusher("8fd548bef3f79484a0ae", {
      cluster: "eu",
      authEndpoint: config.localUrl + "api/pusher/auth",
      auth: {
        params: {
          username: userDetails.first_name,
          photo: "all",
          user_id: props.userId,
        },
      },
    });
    const channel = pusher.subscribe(
      `presence-${eventOptions.code}-lobby`
      // "presence-" + state.theme.event_uid + "-" + type + "-" + passedId
    );
    channel.bind("pusher:subscription_succeeded", (members) => {
      console.log("Zalogowales");
      console.log(members);
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
      console.log("Dodana");
      alert(member.info.username);
      // setUsersOnline(channel.members.count);
      // setWhoIsOnline((prevState) => [
      //   ...prevState,
      //   { username: member.info.username, photo: member.info.photo },
      // ]);
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
      alert(member.info.username);
      // setUsersOnline(channel.members.count);
      // let all = whoIsOnline;
      // all.find((user) => user.id);
    });
  }, []);

  if (userDetails) {
    return (
      <UserInfo.Provider value={userDetailsAndId}>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          {/* {state.theme.notifications.length > 0 ? (
            <div
              style={{
                zIndex: 995,
                position: "fixed",
                bottom: "15px",
                left: "15px",
              }}
            >
              {state.theme.notifications.map((notification) => {
                return (
                  <p
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      borderRadius: "10px",
                    }}
                    className="p-3 animate__animated animate__fadeOut animate__delay-3s"
                  >
                    {notification}
                  </p>
                );
              })}
            </div>
          ) : null} */}
          {userLocation.userLocation ? <Modal /> : null}
          <div
            style={{
              position: "fixed",
              zIndex: "999",
              top: "20px",
              right: "10px",
              height: "calc(100vh - 40px)",
              width: "90px",
              padding: "0",
              transition: "all 0.4s ease-in",
              transitionDelay: "2s",
            }}
            className="d-flex justify-content-center align-items-center"
          >
            <Navbar options={props.options} />
          </div>
          {/* <div
        className="container-fluid"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          zIndex: "800",
          minHeight: "80vh",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
        }}
      ></div> */}
          <div>
            <iframe
              width="100%"
              height="100vh"
              style={{
                width: "100%",
                height: "100vh",
                border: "none",
                maxWidth: "100%",
                position: "fixed",
                zIndex: 0,
                position: "fixed",
                top: 0,
                left: 0,
              }}
              id="kuula-frame"
              frameBorder="0"
              allowFullScreen
              allow="xr-spatial-tracking; gyroscope; accelerometer"
              scrolling="no"
              src={
                "https://kuula.co/share/collection/" +
                props.kuula +
                "?fs=0&vr=0&thumbs=-1&info=0&logo=-1"
              }
            />
          </div>
        </div>
      </UserInfo.Provider>
    );
  } else {
    return <div>Loading</div>;
  }
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    if (user) {
      let userInfo = await fetch(
        config.url + "/wp-json/acf/v3/registrations/" + req.session.user.id
      );
      let res = await fetch(config.url + "wp-json/wp/v2/pages/153");
      let options = await fetch(config.url + "wp-json/acf/v3/options/options");
      if (res.ok && options.ok && userInfo.ok) {
        let optionsJson = await options.json();
        let json = await res.json();
        let userInfoJson = await userInfo.json();
        return {
          props: {
            kuula: json.acf.kuula_code,
            options: optionsJson.acf,
            user: userInfoJson.acf,
            userId: req.session.user.id,
          },
        };
      }
    } else {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  },
  {
    cookieName: "event_userSession",
    password: process.env.COOKIE_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
// export async function getServerSideProps() {
//   let res = await fetch(config.url + "wp-json/wp/v2/pages/153");
//   let options = await fetch(config.url + "wp-json/acf/v3/options/options");
//   if (res.ok && options.ok) {
//     let optionsJson = await options.json();
//     let json = await res.json();
//     return {
//       props: {
//         kuula: json.acf.kuula_code,
//         options: optionsJson.acf,
//       },
//     };
//   }
// }
