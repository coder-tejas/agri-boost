import { StreamChat } from "stream-chat";

export async function POST(req) {
  const { userId } = await req.json();

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  );

  // 👇 Create or get channel AND ADD USER
  const channel = serverClient.channel("messaging", "global", {
    members: [userId],
  });

  await channel.create(); // safe even if already exists

  const token = serverClient.createToken(userId);

  return Response.json({ token });
}
