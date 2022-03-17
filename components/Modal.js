import styles from "../styles/Modal.module.css";
import React from "react";
import { AppContext, UserLocation } from "../pages/_app";
// import AnimateHeight from "react-animate-height";
//Modals
import Profile from "./modals/Profile";
import ProfileUpdate from "./modals/ProfileUpdate";
import Networking from "./modals/Networking";
import Agenda from "./modals/Agenda";
import Help from "./modals/Help";
import ModalMenu from "./ModalMenu";
// import Webinar from "./modals/Webinar";
//Loading
// import Loading from "./Loading";
export default function Modal() {
  //   React.useEffect(() => {
  //     actions.theme.modalLoading;
  //   }, []);
  function renderSwitch(param) {
    switch (param) {
      case "networking":
      case "global-chat":
        return <Networking />;
      case "help":
        return <Help />;
      case "agenda":
        return <Agenda />;
      case "profile":
        return <Profile />;
      case "profile-update":
        return <ProfileUpdate />;
      default:
        return "lobbay";
    }
  }
  const userLocation = React.useContext(UserLocation);

  return (
    <div className={styles["modal-wrapper"]}>
      <div
        className={"container mt-4 " + styles["modal-container"]}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          padding: "2rem",
        }}
      >
        <div className="row">{renderSwitch(userLocation.userLocation)}</div>
      </div>
    </div>
  );
}
