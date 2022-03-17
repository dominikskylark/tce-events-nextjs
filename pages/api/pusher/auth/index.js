import { pusher } from "../../../../lib/index";
import Cors from "cors";
import initMiddleware from "../../../../lib/initMiddleware";

// const cors = initMiddleware(
//   Cors({
//     methods: ["GET", "POST"],
//     origin: ["http://localhost:300"],
//   })
// );
export default async function handler(req, res) {
  // await cors(req, res);
  const { socket_id, channel_name, username, photo, user_id } = req.body;
  const presenceData = {
    user_id: user_id,
    user_info: {
      username,
      photo,
      user_id,
    },
  };
  try {
    const auth = pusher.authenticate(socket_id, channel_name, presenceData);
    res.send(auth);
  } catch (error) {
    console.log(error);
  }
}
