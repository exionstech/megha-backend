import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { userSchema } from "../schema";
import { db } from "../../lib/db";
import { checkBearerAuth } from "../middleware/middleware";

const userRouter = new Hono();

userRouter.use('/*', checkBearerAuth);

userRouter.get("/", async (c) => {
    try {
        const user = await db.user.findMany();

        if (!user) {
            return c.json({ message: "User not found", success: false });
        }

        return c.json({ user, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

userRouter.get("/:id", async (c) => {
    try {
        const { id } = c.req.param();
        const user = await db.user.findUnique({
            where: {
                id: id
            }
        });

        if (!user) {
            return c.json({ message: "User not found", success: false });
        }

        return c.json({ user, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

userRouter.post("/", zValidator('json', userSchema), async (c) => {
    try {
        const data = c.req.valid('json')
        await db.user.create({ data });

        return c.json({
            message: "User created successfully",
            userId: data.id,
            success: true
        });
    } catch (error) {
        console.log(error);
        return c.json({ error: error, success: false });
    }
});

export default userRouter;