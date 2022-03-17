import React from "react";
import { config } from "../../config";

export default ({ id }) => {
  const [panel, setPanel] = React.useState();
  async function fetchy() {
    let response = await fetch(
      config.url + "wp-json/acf/v3/panelists/" + id.ID
    );

    if (response.ok) {
      let json = await response.json();
      setPanel(json.acf);
      console.log(json);
    } else {
      console.log(response.status);
    }
  }
  React.useEffect(() => {
    fetchy();
  }, []);
  if (panel) {
    return (
      <div className="d-flex dark-bg-user p-2 mt-2">
        <div className="row">
          <div className="col-4">
            {panel.photo ? (
              <img src={panel.photo} className="img-fluid user-photo-profile" />
            ) : null}
          </div>

          <div className="col-8">
            <h6>{id.post_title}</h6>
            <p>{panel.job_title + ", " + panel.company}</p>
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading</p>;
  }
};
