import React from "react";
import { config } from "../../config";
import { UserInfo } from "../../pages/lobby";
import { UserLocation } from "../../pages/_app";
import Chat from "../Chat";
import NetworkingChat from "./NetworkingChat";
import NetworkingList from "./NetworkingList";

export default () => {
  const [partnerId, setPartnerId] = React.useState();
  const userLocation = React.useContext(UserLocation);
  const userInfo = React.useContext(UserInfo);
  switch (userLocation.userLocation) {
    case "networking":
      if (partnerId) {
        return <NetworkingChat partnerId={partnerId} userInfo={userInfo} />;
      } else {
        return <NetworkingList setPartnerId={(id) => setPartnerId(id)} />;
      }
    case "global-chat":
      return <Chat type="networking" passedId="0" />;
    default:
      return <p>None</p>;
  }
};
