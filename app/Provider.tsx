import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { ClientSideSuspense, LiveblocksProvider } from "@liveblocks/react/suspense";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const router = useRouter();

  // Check if the user data is still loading
  if (!isLoaded) {
    return <Loader />; // Show a loader while Clerk is determining user status
  }

  // If no user is logged in, redirect to the sign-in page
  if (!clerkUser) {
    router.push('/sign-in');
    return null; // Prevent rendering the component while redirecting
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
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
