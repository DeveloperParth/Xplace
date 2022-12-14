import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction } from "express";

export default (socket: Socket & { userId: string }, next: NextFunction) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  // decode token and attach user to socket
  const decoded: JwtPayload = jwt.verify(
    token,
    process.env.JWT_SECRET
  ) as JwtPayload;
  socket.userId = decoded.id;
  return next();
};
