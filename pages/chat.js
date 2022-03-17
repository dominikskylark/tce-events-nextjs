import Pusher from "pusher-js";
import React from "react";

export default function Chat() {
  const pusher = new Pusher(process.env.NEXT_PUBLIC_key, {
    cluster: "eu",
    authEndpoint: "api/pusher/auth",
  });

  const [howManyUsersOnline, setHowManyUsersOnline] = React.useState(0);

  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      const channel = pusher.subscribe("presence-example");

      // when a user subscribes to the channel
      channel.bind("pusher:subscription_succeeded", (members) => {
        setHowManyUsersOnline(members.count);
      });

      // When a new user joins the chat
      channel.bind("pusher:member_added", (member) => {
        setHowManyUsersOnline(channel.members.count);
      });

      channel.bind("pusher:member_removed", (member) => {
        setHowManyUsersOnline(channel.members.count);
      });
    }

    return () => {
      pusher.unsubscribe("presence-example");
    };
  }, []);

  return <h1>Users online: {howManyUsersOnline}</h1>;
}
