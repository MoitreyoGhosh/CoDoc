"use client";
import Loader from "@/components/Loader";
import { getClerkUsers } from "@/lib/actions/user.actions";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    //publicApiKey={"pk_prod_JOMh…5ZsxUW"}
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default Provider;
