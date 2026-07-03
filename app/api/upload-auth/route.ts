import { getUploadAuthParams } from "@imagekit/next/server"
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    const user = await currentUser();
    if (!user) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token, expire, signature } = getUploadAuthParams({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    })

    return Response.json({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY })
}