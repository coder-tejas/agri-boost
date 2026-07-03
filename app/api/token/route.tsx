import { StreamChat } from "stream-chat";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();

  if (userId !== user.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
    process.env.STREAM_API_SECRET as string
  );

  const channel = serverClient.channel("messaging", "global", {
    members: [userId],
  });

  await channel.create();

  const token = serverClient.createToken(userId);

  return Response.json({ token });
}
