import { Coffee, Hexagon, Calendar, HelpCircle, LogOut } from "react-feather";
import { config } from "../config";
import styles from "../styles/Navbar.module.css";
import { UserLocation } from "../pages/_app";
import { UserInfo } from "../pages/lobby";
import React from "react";
import Router from "next/router";
export default function Navbar({ options }) {
  const userLocation = React.useContext(UserLocation);
  const userInfo = React.useContext(UserInfo);

  const IconSize = 32;
  async function handleSignout() {
    alert("Signing out!");
    let res = await fetch("./api/logout");
    if (res.ok) {
      let json = await res.json();
      alert(JSON.stringify(json));
      Router.push("/");
    }
  }
  return (
    <div className={styles["navbar"]}>
      <ul className={"d-flex align-items-center " + styles["navbar-nav"]}>
        <li className={styles["event-logo"] + " " + styles["menu-item"]}>
          <img src={options.new_master_logo} className="img-fluid" />
        </li>
        <li className={styles["menu-item"]}>
          <img
            src={
              userInfo.details.photo
                ? userInfo.details.photo
                : config.url + "wp-content/uploads/2021/11/avatar-2.jpeg"
            }
            className={styles["user-photo"]}
            alt="This is a small profile image of Digital Ocean’s mascot, a blue smiling shark."
            onClick={() => userLocation.changeUserLocation("profile")}
          />
        </li>
        <li
          className={"button-primary " + styles["menu-item"]}
          style={
            options.has_lobby
              ? {
                  visibility: "display",
                }
              : { visibility: "hidden" }
          }
          onClick={() => userLocation.changeUserLocation(null)}
        >
          <Coffee size={IconSize} className="navbar-icon" />
          <br />
          <span>Lobby</span>
        </li>
        <li
          className={"button-primary " + styles["menu-item"]}
          style={
            options.has_networking
              ? { visibility: "display" }
              : { visibility: "hidden" }
          }
          onClick={() => userLocation.changeUserLocation("networking")}
        >
          <Hexagon size={IconSize} className="navbar-icon" />
          <br />
          Networking
        </li>
        <li
          className={"button-primary " + styles["menu-item"]}
          style={
            options.has_programme
              ? { visibility: "display" }
              : { visibility: "hidden" }
          }
          onClick={() => userLocation.changeUserLocation("agenda")}
        >
          <Calendar size={IconSize} className="navbar-icon" />
          <br />
          Agenda
        </li>
        <li
          className={"button-primary " + styles["menu-item"]}
          style={
            options.has_help_desk
              ? { visibility: "display" }
              : { visibility: "hidden" }
          }
          onClick={() => userLocation.changeUserLocation("help")}
        >
          <HelpCircle size={IconSize} className="navbar-icon" />
          <br />
          Help Desk
        </li>
        <li className={"button-primary " + styles["menu-item"]}>
          <LogOut
            onClick={() => handleSignout()}
            size={IconSize}
            className="navbar-icon"
          />
          <br />
          Sign out
        </li>
      </ul>
    </div>
  );
}
