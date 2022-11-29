import React from "react";

// prop types
type Props = {
  message: string;
  isSent?: boolean;
};

function Message({ message, isSent }: Props) {
  console.log(isSent);
  
  return (
    <>
      <div className={`flex border py-2 px-3 rounded-md ${isSent ? "self-end" : "self-start"}`}>{message}</div>
    </>
  );
}

export default Message;
