import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import { Context } from "./Context";
import SuperJSON from "superjson";

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});
export const router = t.router;
export const publicProcedure = t.procedure;
