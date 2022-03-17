import { withIronSessionApiRoute } from "iron-session/next";
import { config } from "../../../config";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.session.user) {
      let result = await fetch(
        config.url + "wp-json/acf/v3/registrations/" + req.session.user.id
      );
      if (result.ok) {
        let userInfo = await result.json();
        res.json({
          success: true,
          data: userInfo.acf,
        });
      } else {
        let respo = await result.json();
        res.json({
          url:
            config.url + "wp-json/acf/v3/registrations" + req.session.user.id,
          response: respo,
        });
      }
    } else {
      res.json({ success: false, message: "User not found" });
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
