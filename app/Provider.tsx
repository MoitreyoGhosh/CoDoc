"use client"; // Make sure this is a Client Component

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Loader from "@/components/Loader";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  // Check if the user data is still loading
  if (!isLoaded) {
    return <Loader />;
  }

  // If no user is logged in, redirect to the sign-in page
  if (!isSignedIn) {
    redirect("/sign-in");
    return null; // Important: Prevent rendering while redirecting
  }

  // Safely access the email address after user is confirmed
  const emailAddress = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!emailAddress) {
    return <div>Error: No email address found!</div>;
  }

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: emailAddress,
          text,
        });
        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
