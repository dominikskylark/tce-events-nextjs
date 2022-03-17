import React from "react";
import { config } from "../../config";
import AgendaListItem from "./AgendaListItem";
import { AppContext } from "../../pages/_app";
export default () => {
  const eventOptions = React.useContext(AppContext);
  const [whichRoom, setWhichRoom] = React.useState(1);
  const [whichDay, setWhichDay] = React.useState("one");
  const [roomDetails, setRoomDetails] = React.useState(null);
  const [dateOfDay, setDateOfDay] = React.useState(
    new Date(eventOptions.options.start_date)
  );
  // calling the day names
  let days = ["one", "two", "three", "four"];
  days.length = Number(eventOptions.options.number_of_days);

  // cope with date changes

  React.useEffect(() => {
    setRoomDetails(null);
    async function fetchData() {
      const roomPostIds = ["159", "164", "166", "168"];
      let response = await fetch(
        config.url + "wp-json/wp/v2/pages/" + roomPostIds[whichRoom - 1]
      );
      let json = await response.json();
      console.log(json);
      setRoomDetails(json);
    }
    setWhichDay("one");

    fetchData();
  }, [whichRoom]);

  return (
    <>
      <div className="row">
        <ul className="nav nav-pills nav-fill">
          {eventOptions.options.has_conference_room_one ? (
            <li className="nav-item " onClick={() => setWhichRoom(1)}>
              <a className={"nav-link " + (whichRoom == 1 ? "active" : null)}>
                <h3>Room 1</h3>
                {eventOptions.options.room_one_name}
              </a>
            </li>
          ) : null}
          {eventOptions.options.has_conference_room_two ? (
            <li className="nav-item " onClick={() => setWhichRoom(2)}>
              <a className={"nav-link " + (whichRoom == 2 ? "active" : null)}>
                <h3>Room 2</h3>
                {eventOptions.options.room_two_name}
              </a>
            </li>
          ) : null}
          {eventOptions.options.has_conference_room_three ? (
            <li className="nav-item" onClick={() => setWhichRoom(3)}>
              <a className={"nav-link " + (whichRoom == 3 ? "active" : null)}>
                <h3>Room 3</h3>
                {eventOptions.options.room_three_name}
              </a>
            </li>
          ) : null}
          {eventOptions.options.has_conference_room_four ? (
            <li className="nav-item" onClick={() => setWhichRoom(4)}>
              <a className={"nav-link " + (whichRoom == 4 ? "active" : null)}>
                <h3>Room 4</h3>
                {eventOptions.options.room_four_name}
              </a>
            </li>
          ) : null}
        </ul>
      </div>
      <div className="row">
        <ul className="nav nav-pills nav-fill">
          {days.map((day) => {
            return (
              <li className="nav-item" onClick={() => setWhichDay(day)}>
                <a
                  className={"nav-link " + (whichDay == day ? "active" : null)}
                >
                  <h4>Day {day}</h4>
                </a>
              </li>
            );
          })}
        </ul>
        <div className="container">
          {roomDetails && roomDetails.acf[`sessions_day_${whichDay}`]
            ? roomDetails.acf[`sessions_day_${whichDay}`].map((session) => {
                return (
                  <AgendaListItem
                    data={session}
                    day={whichDay}
                    dayDate={dateOfDay}
                    options={eventOptions.options}
                  />
                );
              })
            : null}
        </div>
      </div>
    </>
  );
};
