import Image from "next/image";
import React, { useState } from "react";
import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";
import {
  removeCollaborator,
  updateDocumentAccess,
} from "@/lib/actions/room.actions";

const Collaborator = ({
  roomId,
  email,
  creatorId,
  collaborator,
  user,
}: CollaboratorProps) => {
  const [userType, setuserType] = useState(collaborator.userType || "viewer");
  const [loading, setLoading] = useState(false);

  const isOwner = user.id === creatorId;
  const isCurrentUserProfile = user.id === collaborator.id;

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);
    await updateDocumentAccess({
      roomId,
      email,
      userType: type as UserType,
      updatedBy: user,
    });
    setLoading(false);
  };
  const removeCollaboratorHandler = async (email: string) => {
    setLoading(true);
    await removeCollaborator({ roomId, email });
    setLoading(false);
  };

  return (
    <li className="flex items-center justify-between gap-2 py-3">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          alt={collaborator.name}
          width={36}
          height={36}
          className="size-9 rounded-full"
        />
        <div>
          <p className="line-clamp-1 text-sm font-semibold leading-4 text-white">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>
      {isCurrentUserProfile && isOwner ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : isOwner ? (
        <div className="flex items-center gap-2">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setuserType}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
          >
            Remove
          </Button>
        </div>
      ) : collaborator.id === creatorId ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : (
        <span className="text-sm text-blue-100">
          {userType.charAt(0).toUpperCase() + userType.slice(1)}
        </span>
      )}
    </li>
  );
};

export default Collaborator;
