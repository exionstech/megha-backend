import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { authSchema } from "../schema";
import { db } from "../../lib/db";
import { sign } from 'hono/jwt'
import { env } from 'hono/adapter'

const authRouter = new Hono();


authRouter.post("/login", zValidator('json', authSchema), async (c) => {
    const { SECRET } = env<{ SECRET: string }>(c);
    try {
        const { email, password } = c.req.valid('json')
        const user = await db.user.findUnique({
            where: {
                email: email
            }
        })

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