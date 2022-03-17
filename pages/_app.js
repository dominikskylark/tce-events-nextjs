import "../styles/globals.css";
import "../styles/bootstrap.min.css";
import React from "react";
import Layout from "../components/Layout";
import { config } from "../config";
// import { AppContext } from "../context/appContext";

export const AppContext = React.createContext();
export const UserLocation = React.createContext();

function MyApp({ Component, pageProps }) {
  const [userLocation, setUserLocation] = React.useState();
  const [eventOptions, setEventOptions] = React.useState();

  const userLocationState = {
    userLocation,
    changeUserLocation: (value) => setUserLocation(value),
  };
  const fullEventOptions = {
    code: btoa(config.url),
    options: eventOptions,
  };
  React.useEffect(() => {
    async function getEventDetails() {
      let res = await fetch(config.url + "wp-json/acf/v3/options/options");
      if (res.ok) {
        let json = await res.json();
        setEventOptions(json.acf);
      }
    }
    getEventDetails();
  }, []);
  return (
    <Layout>
      <AppContext.Provider value={fullEventOptions}>
        <UserLocation.Provider value={userLocationState}>
          <Component {...pageProps} />
        </UserLocation.Provider>
      </AppContext.Provider>
    </Layout>
  );
}

export default MyApp;

export async function getStaticProps() {
  let res = await fetch(
    "https://eventadmin.skylark.digital/wp-json/acf/v3/options/options"
  );
  if (res.ok) {
    let options = await res.json();
    return {
      props: {
        options,
      },
    };
  }
}
