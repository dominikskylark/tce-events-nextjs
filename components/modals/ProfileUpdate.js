import React from "react";
import { config } from "../../config";
export default () => {
  const [profile, setProfile] = React.useState();

  React.useEffect(() => {
    async function fetchUserData() {
      let res = await fetch(config.localUrl + "api/user/info");
      if (res.ok) {
        let json = await res.json();
        if (json.success) {
          setProfile({
            first_name: json.data.first_name,
            last_name: json.data.last_name,
            company: json.data.company,
            job_title: json.data.job_title,
            telephone: json.data.telephone,
            photo: json.data.photo,
          });
        } else {
          alert("There was an error with getting your data. Try again later.");
        }
      }
    }
    fetchUserData();
  }, []);
  async function handlePhotoUpdate(e) {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    console.log("Current file: ", file);
    let photo_url = "";
    let mediaResponse = await fetch(config.url + "wp-json/wp/v2/media", {
      method: "POST",
      headers: {
        Authorization:
          "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
      },
      body: formData,
    });
    let json = await mediaResponse.json();
    console.log(json);
    if (mediaResponse.ok) {
      photo_url = json.source_url;
      const passBody = {
        fields: {
          photo: photo_url,
        },
      };
      console.log("Photko: ", photo_url);
      let amendResponse = await fetch(
        config.url + "wp-json/acf/v3/registrations/851",
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(passBody),
        }
      );
      console.log(passBody);
      if (amendResponse.ok) {
        const jsonek = await amendResponse.json();
        console.log(jsonek);
      } else {
        let jsonka = await amendResponse.json();
        console.log(jsonka);
      }
    } else {
      console.log("sth is fucked up");
    }
  }

  async function handleProfileUpdate() {
    let response = await fetch(config.localUrl + "api/user/update", {
      method: "POST",
      body: JSON.stringify({
        fields: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          company: profile.company,
          job_title: profile.job_title,
          telephone: profile.telephone,
        },
      }),
    });

    if (response.ok) {
      let content = await response.json();
      console.log(profile);
      console.log(content);
    } else {
      let content = await response.json();
      console.log(content);
    }
  }
  if (profile) {
    return (
      <div className="modal-background p-5">
        <div className="row">
          <div className="col-xs-12">
            <h3>Edit Profile</h3> <hr />
          </div>
          <div className="col-xs-12 col-md-4">
            <img src={profile.photo} className="img-fluid" />
            <label for="file-upload" className="btn mt-3 button-primary">
              Upload a new photo
            </label>

            <input
              id="file-upload"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handlePhotoUpdate(e)}
            />
          </div>
          <div className="col-xs-12 col-md-8">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="name"
                type="text"
                placeholder="Name"
                value={profile.first_name}
                onChange={(e) =>
                  setProfile({ ...profile, first_name: e.target.value })
                }
                data-sb-validations="required"
              />
              <label for="name">Name</label>
              <div
                className="invalid-feedback"
                data-sb-feedback="name:required"
              >
                Name is required.
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="surname"
                type="text"
                placeholder="Surname"
                onChange={(e) =>
                  setProfile({ ...profile, last_name: e.target.value })
                }
                value={profile.last_name}
                data-sb-validations="required"
              />
              <label for="surname">Surname</label>
              <div
                className="invalid-feedback"
                data-sb-feedback="surname:required"
              >
                Surname is required.
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="company"
                type="text"
                placeholder="Company"
                value={profile.company ? profile.company : ""}
                onChange={(e) =>
                  setProfile({ ...profile, company: e.target.value })
                }
                data-sb-validations="required"
              />
              <label for="company">Company</label>
              <div
                className="invalid-feedback"
                data-sb-feedback="company:required"
              >
                Company is required.
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="job"
                type="text"
                placeholder="Job"
                value={profile.job_title ? profile.job_title : ""}
                onChange={(e) =>
                  setProfile({ ...profile, job_title: e.target.value })
                }
                data-sb-validations="required"
              />
              <label for="job">Job</label>
              <div className="invalid-feedback" data-sb-feedback="job:required">
                Job is required.
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="telephone"
                type="text"
                placeholder="Telephone"
                value={profile.telephone ? profile.telephone : ""}
                onChange={(e) =>
                  setProfile({ ...profile, telephone: e.target.value })
                }
                data-sb-validations="required"
              />
              <label for="telephone">Telephone</label>
              <div
                className="invalid-feedback"
                data-sb-feedback="telephone:required"
              >
                Telephone is required.
              </div>
            </div>

            <div className="d-none" id="submitErrorMessage">
              <div className="text-center text-danger mb-3">
                Error sending message!
              </div>
            </div>
            <div className="d-grid">
              <button
                className="btn btn-lg button-primary"
                id="submitButton"
                onClick={handleProfileUpdate}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loadin...</p>;
  }
};
