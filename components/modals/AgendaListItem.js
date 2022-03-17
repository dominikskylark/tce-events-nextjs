import Panelist from "./Panelist";
import React from "react";
import { AppContext } from "../../pages/_app";
export default ({ data, day }) => {
  const eventOptions = React.useContext(AppContext);
  const [dayDate, setDayDate] = React.useState(
    new Date(eventOptions.options.start_date)
  );
  const today = new Date();
  const todayISO = new Date().toISOString();
  const fitchka = new Date(eventOptions.options.start_date);

  console.log(dayDate);
  function convertTime12To24(time) {
    const lowercase = time.toLowerCase();
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = lowercase.match(/\s(.*)$/)[1];
    if (AMPM === "pm" && hours < 12) hours = hours + 12;
    if (AMPM === "am" && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return sHours + ":" + sMinutes;
  }

  const timeDifference =
    parseFloat(data[`end_time_day_${day}`].replace(":", "")) -
    parseFloat(data[`start_time_day_${day}`].replace(":", ""));

  //Check if allowed to join

  const meetingStart = new Date();
  meetingStart.setHours(
    parseInt(convertTime12To24(data[`start_time_day_${day}`]).substring(0, 2)),
    parseInt(convertTime12To24(data[`start_time_day_${day}`]).substring(3, 5)),
    parseInt("0")
  );
  const meetingEnd = new Date();
  meetingEnd.setHours(
    parseInt(convertTime12To24(data[`end_time_day_${day}`]).substring(0, 2)),
    parseInt(convertTime12To24(data[`start_time_day_${day}`]).substring(3, 5)),
    parseInt("0")
  );

  //Show the right value on the button
  function setButtonContent() {
    // <Switch>
    //         <span
    //           when={
    //             todayISO === dayDate &&
    //             today >= meetingStart &&
    //             today <= meetingEnd
    //           }
    //         >
    //           Join
    //         </span>
    //         <span
    //           when={
    //             todayISO > dayDate ||
    //             (todayISO === dayDate && today >= meetingEnd)
    //           }
    //         >
    //           Meeting ended
    //         </span>
    //         <span>Meeting not started</span>
    //         //TODO: Add on Demand watch
    //       </Switch>
    switch (null) {
      case todayISO === dayDate && today >= meetingStart && today <= meetingEnd:
        return "Join";
      case todayISO > dayDate:
      case todayISO === dayDate && today >= meetingEnd:
        return "Meeting ended";
      default:
        return "Meeting not started";
    }
  }
  React.useEffect(() => {
    console.log("rebuilding");
    switch (day) {
      case "one":
        setDayDate(eventOptions.options.start_date);
        break;
      case "two":
        const adjusted1 = fitchka.setDate(fitchka.getDate() + 1);
        setDayDate(new Date(adjusted1).toISOString());
        break;
      case "three":
        const adjusted2 = fitchka.setDate(fitchka.getDate() + 2);
        setDayDate(new Date(adjusted2).toISOString());
        break;
      case "four":
        const adjusted3 = fitchka.setDate(fitchka.getDate() + 3);
        setDayDate(new Date(adjusted3).toISOString());
        break;
      default:
        setDayDate(dayDate.toISOString());
        break;
    }
  }, [day]);
  return (
    <div className="row agenda-list-container mt-2 mb-2 ">
      <div
        className="col-md-2 col-xs-12 order-2 order-md-1 d-flex flex-column justify-content-center align-items-center p-2"
        style={{
          backgroundColor: eventOptions.options.primary_button_colour,
          borderTopLeftRadius: "25px",
          borderBottomLeftRadius: "25px",
          color: eventOptions.options.primary_button_text_colour,
        }}
      >
        <h4>Start time</h4>
        <h5>{data[`start_time_day_${day}`]}</h5>
        <br />
        {timeDifference > 100
          ? parseInt(timeDifference / 60) + " hours"
          : timeDifference + " minutes"}
      </div>
      <div className="col-md-4 col-xs-12 order-1 order-md-2 p-3">
        <h1 className="sessions-title">{data[`title_day_${day}`]}</h1>
      </div>
      <div className="col-md-4 order-3">
        {data[`panelists_day_${day}`]
          ? data[`panelists_day_${day}`].map((panelist) => {
              return (
                <p>
                  <Panelist id={panelist} />
                </p>
              );
            })
          : null}
      </div>
      <div className="col-md-2 order-4 d-flex justify-content-center align-items-center">
        <button
          className="btn btn-lg button-primary"
          onClick={() => actions.theme.setWhereUser("webinar")}
          disabled={
            todayISO === dayDate && today >= meetingStart && today <= meetingEnd
              ? false
              : true
          }
        >
          <span>{setButtonContent()}</span>
        </button>
      </div>
      <style jsx>
        {`
          .agenda-list-container {
            background-color: white;
            border-radius: 25px;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            color: ${eventOptions.options.primary_button_text_colour};
          }
          .sessions-title {
            color: ${eventOptions.options.secondary_button_text_colour};
          }
        `}
      </style>
    </div>
  );
};
