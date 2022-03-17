// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { config } from "../../../../config";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (!req.session.user) {
      res.send({
        success: false,
        message: "You need to check in to update your data",
      });
    }

    let result = await fetch(
      config.url + "wp-json/acf/v3/registrations/" + req.session.user.id,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
          "Content-Type": "application/json",
        },
        body: req.body,
      }
    );
    if (result.ok) {
      let json = await result.json();
      res.send(json);
      console.log(json);
    } else {
      let json = await result.json();
      res.send(json);
      console.log(json);
    }
  },
  {
    cookieName: "event_userSession",
    password: process.env.COOKIE_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
