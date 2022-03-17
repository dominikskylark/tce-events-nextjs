// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { config } from "../../config";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function loginRoute(req, res) {
    let requestBody = JSON.parse(req.body);
    const requestEmail = requestBody.email;
    // get user from database then:

    let result = await fetch(config.url + "/wp-json/acf/v3/registrations");
    if (result.ok) {
      let json = await result.json();
      let checking = json.filter((mail) => mail.acf.email === requestEmail);
      if (checking.length !== 0) {
        req.session.user = {
          id: checking[0].id,
        };
        await req.session.save();
        res.json({ message: "Logged in" });
      }
    } else {
      res.json({ message: "You are not part of the event" });
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
// export default withIronSessionApiRoute(
//     async function loginRoute(req, res) {
//       // get user from database then:
//       let result = await fetch(config.url + "/wp-json/acf/v3/registrations");
//       if (result.ok) {
//         let json = await result.json();
//         let checking = json.filter((mail) => mail.acf.email === requestEmail);
//         if (checking.length !== 0){
//             req.session.user = {
//                 id: 230,
//                 admin: true,
//               };
//               await req.session.save();
//               res.send({ ok: true });
//         }
//     } else {
//         res.send({ok: false})
//     }
//     },
//     {
//       cookieName: "myapp_cookiename",
//       password: "complex_password_at_least_32_characters_long",
//       // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
//       cookieOptions: {
//         secure: process.env.NODE_ENV === "production",
//       },
//     },
//   );
// export default async function handler(req, res) {
//   let requestBody = JSON.parse(req.body);
//   const requestEmail = requestBody.email;
//   if (req.method === "POST") {
//     let result = await fetch(config.url + "/wp-json/acf/v3/registrations");
//     if (result.ok) {
//       let json = await result.json();
//       let checking = json.filter((mail) => mail.acf.email === requestEmail);
//       if (checking.length !== 0) {
//         res.status(200).json({
//           status: "success",
//           message: "Successfully logged in",
//           data: checking,
//         });
//       } else {
//         res.status(201).json({
//           status: "failed",
//           message: "You are not registered for the event",
//           data: req.body,
//         });
//       }
//     } else {
//       res.status(500).json({ message: "Yolo" });
//     }
//   } else {
//     res
//       .status(200)
//       .json({ message: "Thank you for using our platform", body: req.body });
//   }
//   if (req.method === "POST") {
//     let response = await fetch(config.url + "/wp-json/acf/v3/registrations");
//     console.log("Logging In");
//     if (response.ok) {
//       let json = await response.json();
//       let checking = json.filter((mail) => mail.acf.email === value);
//       if (checking.length !== 0) {
//         const user = checking[0].acf;

//         const userData = JSON.stringify({
//           id: btoa(checking[0].id),
//         });
//         //   const salt = state.theme.salt;
//         //   const ciphertext = CryptoJS.AES.encrypt(
//         //     userData,
//         //     salt
//         //   ).toString();
//         //   console.log(ciphertext);
//         //   state.theme.userDetails = JSON.parse(userData);
//         //   state.theme.loading = false;
//         //   document.cookie = `uid=${ciphertext}; path=/`;
//         res.status(200).json({ message: "Successfully logged in", data: json });
//       } else if (req.method === "GET") {
//         res.status(200).json({ message: "Thank you for using our platform" });
//       } else {
//         res.status(500).json({ message: "There was an error" });
//       }
//     }
//   }
// }
