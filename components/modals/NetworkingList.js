import React from "react";
import { config } from "../../config";
// import Loading from "../Loading";
// import ModalMenu from "../ModalMenu";
import { UserInfo } from "../../pages/lobby";
import ModalMenu from "../ModalMenu";
import { MessageCircle } from "react-feather";

export default ({ setPartnerId }) => {
  const userInfo = React.useContext(UserInfo);
  console.log(userInfo);
  const [currentlyFollowing, setCurrentlyFollowing] = React.useState([]);
  const [registrations, setRegistrations] = React.useState();
  const [networkingId, setNetworkingId] = React.useState();

  async function fetchRegistrations() {
    let response = await fetch(config.url + "/wp-json/acf/v3/registrations/");

    if (response.ok) {
      let json = await response.json();
      setRegistrations(json);
    } else {
      console.log(response.status);
    }
  }

  async function fetchCurrentlyFollowing() {
    let response = await fetch(
      config.url + "/wp-json/acf/v3/registrations/" + userInfo.id
    );

    if (response.ok) {
      let json = await response.json();
      console.log(json);
      setCurrentlyFollowing(json.acf.following);
      console.log(currentlyFollowing);
    } else {
      console.log(response.status);
    }
  }

  React.useEffect(() => {
    fetchRegistrations();
    fetchCurrentlyFollowing();
  }, []);

  const Registrant = ({ data }) => {
    const [followStatus, setFollowStatus] = React.useState(false);
    const userInfo = React.useContext(UserInfo);
    const id = data.id;

    React.useEffect(() => {
      if (currentlyFollowing) {
        let checking = currentlyFollowing.filter((user) => user.users_id == id);
        // console.log(checking);
        if (checking.length !== 0) {
          setFollowStatus(true);
        }
      }
    }, []);

    async function handleFollow(data) {
      console.log(registrations);
      const url = config.url + "wp-json/acf/v3/registrations/" + userInfo.id;
      const passBody = {
        fields: {
          following: [
            ...currentlyFollowing,
            { users_id: data.id.toString(), status: "accepted" },
          ],
        },
      };
      let res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
        },
        body: JSON.stringify(passBody),
      });
      console.log(res);
      console.log(url);
      console.log("passedBody", passBody);
      if (res.ok) {
        let json = await res.json();
        console.log(json);
        setFollowStatus(!followStatus);
      } else {
        let json = await res.json();
        alert(JSON.stringify(json));
      }
    }
    if (data.id !== userInfo.id) {
      return (
        <div className="col-xs-12 col-lg-6 col-xl-4 ">
          <div className="card mb-3 p-3">
            <img
              src={
                data.acf.photo
                  ? data.acf.photo
                  : "./assets/icons/default-profile.png"
              }
              className="card-img-top d-md-none"
              alt="..."
            />
            <div className="row g-0">
              <div className="col-md-4 d-none d-md-block">
                <img
                  src={
                    data.acf.photo
                      ? data.acf.photo
                      : "./assets/icons/default-profile.png"
                  }
                  className="img-fluid user-photo-profile "
                  alt={data.acf.first_name}
                  onClick={() => setNetworkingId(id)}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body d-flex flex-column justify-items-between align-items-stretch">
                  <h5 className="card-title">
                    {data.acf.first_name + " " + data.acf.last_name}
                  </h5>
                  <p className="card-text">
                    {data.acf.job_title && data.acf.company
                      ? data.acf.job_title + " at " + data.acf.company
                      : "-"}
                  </p>
                  {followStatus ? (
                    <div className="d-flex justify-content-space-around">
                      <button
                        className="btn button-primary"
                        onClick={() => setPartnerId(data.id)}
                      >
                        <MessageCircle />
                      </button>
                      <button
                        className={
                          "btn " +
                          (followStatus ? "button-secondary" : "button-primary")
                        }
                        onClick={() => handleFollow(data)}
                      >
                        Unfollow
                      </button>
                    </div>
                  ) : (
                    <button
                      className={
                        "btn " +
                        (followStatus ? "button-secondary" : "button-primary")
                      }
                      onClick={() => handleFollow(data)}
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  if (registrations) {
    return (
      <>
        <ModalMenu />
        <div className="row">
          <p>{networkingId}</p>
          {registrations && currentlyFollowing
            ? registrations.map((registrant) => {
                return (
                  <Registrant
                    data={registrant}
                    onClick={() => alert(registrant.id)}
                  />
                );
              })
            : null}
        </div>
      </>
    );
  } else {
    // return <Loading />;
    return <h1>Loading</h1>;
  }
};
