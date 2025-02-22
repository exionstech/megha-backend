import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { userSchema } from "../schema";
import { checkBearerAuth } from "../middleware/middleware";
import { Environment } from "../binding";
import { initDbConnect } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const userRouter = new Hono<Environment>();

userRouter.use('/*', checkBearerAuth);

userRouter.get("/", async (c) => {
    const db = initDbConnect(c.env.DB);
    
    try {
        const data = await db.select().from(users);
        
        if (!data) {
            return c.json({ message: "Users not found", success: false });
        }
        
        return c.json({ data, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

userRouter.get("/:id", async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const { id } = c.req.param();
        const user = await db.select().from(users).where(eq(users.id, id)).get();

        if (!user) {
            return c.json({ message: "User not found", success: false });
        }

        return c.json({ user, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

userRouter.post("/", zValidator('json', userSchema), async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const data = c.req.valid('json')
        await db.insert(users).values({
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password
        })

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

userRouter.post("/:id", zValidator('json', userSchema), async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const data = c.req.valid('json')
        await db.update(users).set({
            name: data.name,
            email: data.email,
            password: data.password
        }).where(eq(users.id, data.id));

        return c.json({
            message: "User updated successfully",
            userId: data.id,
            success: true
        });
    } catch (error) {
        console.log(error);
        return c.json({ error: error, success: false });
    }
});

export default userRouter;