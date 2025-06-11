import { chatRouter } from "./chat";
import { router } from "../../server";

export const appRouter = router({
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
