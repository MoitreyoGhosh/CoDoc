import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response(JSON.stringify({ error: "User not authenticated" }), {
      status: 401,
    });
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  // Ensure emailAddresses exists and has at least one email
  if (!emailAddresses || emailAddresses.length === 0) {
    return new Response(JSON.stringify({ error: "No email addresses found" }), {
      status: 400,
    });
  }

  const user = {
    id: clerkUser.id,
    info: {
      id,
      name: `${firstName ?? ''} ${lastName ?? ''}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl ?? "",
      color: getUserColor(id),
    },
  };

  try {
    // Identify the user with Liveblocks
    const { status, body } = await liveblocks.identifyUser(
      {
        userId: user.info.email,
        groupIds: [], // You can pass relevant group IDs if needed
      },
      { userInfo: user.info }
    );

    return new Response(body, { status });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to identify user", details: error }),
      {
        status: 500,
      }
    );
  }
}
