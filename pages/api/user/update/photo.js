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
    let photo_url = "";

    let mediaResponse = await fetch(config.url + "wp-json/wp/v2/media", {
      method: "POST",
      headers: {
        Authorization:
          "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
      },
      body: JSON.stringify(req.body.formData),
    });
    let json = await mediaResponse.json();
    if (mediaResponse.ok) {
      photo_url = json.source_url;
      console.log("Photko: ", photo_url);
      let amendResponse = await fetch(
        config.url + "wp-json/wp/v2/registrations/851",
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              photo: photo_url,
            },
          }),
        }
      );

      if (amendResponse.ok) {
        const jsonek = await amendResponse.json();
        res.json(jsonek);
      } else {
        let jsonka = await amendResponse.json();
        res.send({ ok: false, message: jsonka });
      }
    } else {
      let mediaResponse;
      res.send({ ok: false, message: json });
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
