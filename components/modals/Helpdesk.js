import Switch from "@frontity/components/switch";
import { connect, fetch } from "frontity";
import React from "react";
import Loading from "../Loading";
import ModalMenu from "../ModalMenu";
import Chat from "./Chat";

export default connect(({ state, actions }) => {
  const [help, setHelp] = React.useState();
  async function fetchData() {
    let response = await fetch(state.source.url + "/wp-json/wp/v2/pages/269");
    if (response.ok) {
      let json = await response.json();
      console.log(json);
      setHelp(json);
    } else {
      console.log(response.status);
    }
  }

  React.useEffect(() => {
    fetchData();
  }, []);
  if (help) {
    return (
      <>
        <ModalMenu />
        <div className="modal-background animate__animated animate__fadeIn">
          <Switch>
            <h3 when={state.theme.whereUser === "help"}>F.A.Q.</h3>
            <h3 when={state.theme.whereUser === "help-videos"}>Help videos</h3>
            <h3 when={state.theme.whereUser === "help-chat"}>Help chat</h3>
          </Switch>
          <hr />
          <Switch>
            <div when={state.theme.whereUser === "help"}>
              {help.acf.faqs
                ? help.acf.faqs.map((faq) => {
                    return (
                      <div>
                        <h5 className="placeholder-glow">{faq.question}</h5>
                        <p className="placeholder-glow">
                          {faq.answer.replace(/(<([^>]+)>)/gi, "")}
                        </p>
                      </div>
                    );
                  })
                : "No Frequently Asked Questions"}
            </div>
            <div
              className="row animate__animated animate__fadeIn"
              when={state.theme.whereUser === "help-videos"}
            >
              {help.acf.help_videos
                ? help.acf.help_videos.map((video) => {
                    const videoId = video.video_url.substring(
                      video.video_url.length - 9,
                      video.video_url.length
                    );
                    let thumbnail = "";
                    async function getVideoThumbnail(videoId) {
                      let response = await fetch(
                        "https://vimeo.com/api/v2/video/" + videoId + ".json"
                      );
                      if (response.ok) {
                        let json = await response.json();
                        console.log(json);
                        thumbnail = json[0].thumbnail_medium;
                      } else {
                        console.log(response.status);
                      }
                    }
                    getVideoThumbnail(videoId);
                    return (
                      <div className="col-xl-4">
                        <h3>{video.video_name}</h3>
                        {thumbnail ? (
                          <img
                            src={getVideoThumbnail(videoId)}
                            className="img-fluid"
                            style={{
                              aspectRatio: "16/9",
                              overflow: "hidden",
                            }}
                            onClick={() => actions.theme.setVideo(videoId)}
                          />
                        ) : null}
                      </div>
                    );
                  })
                : "No videos"}
            </div>
            <Chat
              when={state.theme.whereUser === "help-chat"}
              type="helpdesk"
              passedId={state.theme.userDetails.id}
            />
          </Switch>
        </div>
      </>
    );
  } else {
    return <Loading />;
  }
});
