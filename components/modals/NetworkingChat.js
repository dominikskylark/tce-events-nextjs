import React from "react";
import { config } from "../../config";
import styles from "../../styles/Modal.module.css";
import defaultPhoto from "../../public/assets/icons/default-profile.png";

import Chat from "../Chat";

export default ({ partnerId, userInfo }) => {
  const chatId =
    partnerId > userInfo.id
      ? `${userInfo.id}-${partnerId}`
      : `${partnerId}-${userInfo.id}`;
  const [partnerDetails, setPartnerDetails] = React.useState();

  React.useEffect(() => {
    async function fetchPartnerDetails() {
      let res = await fetch(
        config.url + "wp-json/acf/v3/registrations/" + partnerId
      );
      if (res.ok) {
        let json = await res.json();
        console.log(json);
        setPartnerDetails(json.acf);
      }
    }
    fetchPartnerDetails();
  }, []);
  if (partnerDetails) {
    return (
      <div className="row">
        <div className="col-xl-4">
          <div>
            You're chatting with...
            <div>
              <img
                src={partnerDetails.photo ? partnerDetails.photo : defaultPhoto}
                style={{ borderRadius: "50%", aspectRatio: "1/1" }}
                className="img-fluid"
              />
              <h2>
                {partnerDetails.first_name + " " + partnerDetails.last_name}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <Chat
            type="private"
            partnerDetails={partnerDetails}
            passedId={chatId}
          />
        </div>
      </div>
    );
  } else {
    return <h2>Please wait</h2>;
  }
};
