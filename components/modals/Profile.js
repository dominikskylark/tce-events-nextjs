import React from "react";
import { config } from "../../config";
import ModalMenu from "../ModalMenu";
import { UserLocation } from "../../pages/_app";
export default ({ state, actions }) => {
  const [userDetails, setUserDetails] = React.useState();
  const userLocation = React.useContext(UserLocation);
  async function fetchUserData() {
    let response = await fetch(
      config.url + "/wp-json/acf/v3/registrations/851"
    );
    if (response.ok) {
      let json = await response.json();
      console.log(json.acf);
      setUserDetails(json.acf);
    } else {
      console.log(response.status);
    }
  }
  React.useEffect(() => {
    fetchUserData();
  }, []);

  if (userDetails) {
    return (
      <>
        <div className="container">
          <div
            style={{ backgroundColor: "white" }}
            className="modal-background p-5"
          >
            <div className="row">
              <div className="col-xs-12">
                <h2>Profile</h2>
                <hr />
              </div>
              <div className="col-xs-12 col-sm-5 col-xl-2">
                <img
                  src={userDetails.photo}
                  className="user-photo-profile img-fluid mb-xs-3"
                />
              </div>
              <div className="col-xs-12 col-sm-7 d-flex flex-column justify-items-center">
                <h3>{userDetails.first_name + " " + userDetails.last_name}</h3>
                {userDetails.job_title && userDetails.company
                  ? `${userDetails.job_title} at ${userDetails.company}`
                  : null}
              </div>
              <div className="col-xl-3 col-md-12 p-3 mt-sm-3 contact-details">
                <h4>Contact Details</h4>
                <h6>Telephone</h6>
                {userDetails.telephone ? (
                  <h5>{userDetails.telephone}</h5>
                ) : (
                  "Not specified"
                )}
                <h6>Email</h6>
                {userDetails.email}
              </div>
            </div>
            <div className="row mt-5">
              <button
                className="btn btn-primary"
                onClick={() =>
                  userLocation.changeUserLocation("profile-update")
                }
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
};
