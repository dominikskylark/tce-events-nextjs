import { pusher } from "../../../lib";
// import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  const { channel, action, payload } = req.body;
  // const client = await clientPromise;
  console.log(req.body);
  await pusher.trigger(channel, action, {
    payload,
  });
  // await client.db().collection("chats").insertOne({
  //   _id: channel,
  //   payload,
  // });
  res.json({ status: 200 });
}
