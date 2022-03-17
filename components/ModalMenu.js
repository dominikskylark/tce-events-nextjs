import React from "react";
import { UserLocation } from "../pages/_app";

const ModalMenu = () => {
  const userLocation = React.useContext(UserLocation);
  function switchProvider() {
    switch (userLocation.userLocation) {
      case "networking":
      case "profile":
        return (
          <>
            <li className="nav-item">
              <a
                className={
                  userLocation === "profile" ? "nav-link active" : "nav-link"
                }
                onClick={() => userLocation.changeUserLocation("profile")}
              >
                Profile
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  userLocation === "networking" ? "nav-link active" : "nav-link"
                }
                onClick={() => userLocation.changeUserLocation("networking")}
              >
                Connections
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => userLocation.changeUserLocation("global-chat")}
              >
                Chat
              </a>
            </li>
          </>
        );
      case "help":
      case "help-videos":
        return (
          <>
            <li className="nav-item">
              <a
                className={
                  userLocation === "help" ? "nav-link active" : "nav-link"
                }
                onClick={() => userLocation.changeUserLocation("help")}
              >
                FAQ
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  userLocation === "help-videos"
                    ? "nav-link active"
                    : "nav-link"
                }
                onClick={() => userLocation.changeUserLocation("help-videos")}
              >
                Videos
              </a>
            </li>
            <li className="nav-item">
              <a
                className={
                  userLocation === "help-chat" ? "nav-link active" : "nav-link"
                }
                onClick={() => userLocation.changeUserLocation("help-chat")}
              >
                Help Chat
              </a>
            </li>
          </>
        );
      default:
        return null;
    }
  }
  return (
    <div className="row">
      <ul className="nav nav-pills nav-fill">{switchProvider()}</ul>
    </div>
  );
};

export default ModalMenu;
