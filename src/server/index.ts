import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { postRouter } from "./routers/post-router";

export const app = new Hono().use(cors());

app.get("/", (c) => c.text("Hello Cloudflare Workers!"));
const appRouter = app.route("/post", postRouter);

export const httpHandler = handle(app);
export default app;

export type AppType = typeof appRouter;
