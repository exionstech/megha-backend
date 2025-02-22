import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { authSchema } from "../schema";
import { sign } from 'hono/jwt'
import { env } from 'hono/adapter'
import { initDbConnect } from "../db";
import { Environment } from "../binding";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const authRouter = new Hono<Environment>();

authRouter.post("/login", zValidator('json', authSchema), async (c) => {
    const { SECRET } = env<{ SECRET: string }>(c);
    const db = initDbConnect(c.env.DB);
    
    try {
        const { email, password } = c.req.valid('json')
        const user = await db.select().from(users).where(eq(users.email, email)).get();

        if (!user) {
            return c.json({ message: "User not found", success: false });
        }

        if (user.password !== password) {
            return c.json({ message: "Password is incorrect", success: false });
        }

        const payload = {
            id: user.id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        }
        const token = await sign(payload, SECRET);

        return c.json({ message: "User logged in successfully", token: token, success: true });
    } catch (error) {
        console.log(error)
        return c.json({ error: error, success: false });
    }
});

export default authRouter;