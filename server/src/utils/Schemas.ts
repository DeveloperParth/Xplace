import { z } from "zod";

export const CreateMessageSchema = z.object({
  body: z.object({
    text: z.string({
      required_error: "Message text is required",
    }),
    replyTo: z.string().optional(),
    serverId: z.string({
      required_error: "Server ID is required",
    }),
    channelId: z.string({
      required_error: "Channel ID is required",
    }),
  }),
});


