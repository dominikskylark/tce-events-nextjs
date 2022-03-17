// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { config } from "../../../config";
export default async function handler(req, res) {
  const parsed = JSON.parse(req.body);
  let followingCurrent = [];
  let currentFollowing = await fetch(config.url + "wp-json/acf/v3/pages/851");
  if (currentFollowing.ok) {
    let json = await currentFollowing.json();
    followingCurrent = json.acf.following;
  }
  let response = await fetch(config.url + "wp-json/acf/v3/pages/851", {
    method: "POST",
    Authorization:
      "Basic ZG9taW5pa3phY3plazpvU2RzIDZZRFIgSDZGTCBqUzJFIEVkSXggMFFJYw==",
    "Content-Type": "application/json",
    body: JSON.stringify({
      fields: {
        following: [
          followingCurrent,
          {
            users_id: parsed.userId,
            status: "accepted",
          },
        ],
      },
    }),
  });
  if (response.status === 200) {
    let json = await response.json();
    res.send(json);
  } else {
    let json = await response.json();
    res.send(json);
  }
}
