import React from "react";
const Users = ({ roomUsers }) => {
  return (
    <div
      className="flex items-center gap-2 bg-grey1 text-grey3 shadow-md
    px-5 py-2 text-xl font-medium overflow-x-auto"
    >
      {roomUsers.map((user) => {
        return <p key={user.userId}>{user.userName}</p>;
      })}
    </div>
  );
};

export default Users;
