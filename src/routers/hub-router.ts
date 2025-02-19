import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { hubSchema } from "../schema";
import { db } from "../../lib/db";
import { checkBearerAuth } from "../middleware/middleware";

const hubRouter = new Hono();

hubRouter.use("/*", checkBearerAuth);

hubRouter.get("/", async (c) => {
    try {
        const hub = await db.hub.findMany();

        if (!hub) {
            return c.json({ message: "Hub not found", success: false });
        }

        return c.json({ hub, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.get("/:id", async (c) => {
    try {
        const { id } = c.req.param();
        const hub = await db.hub.findUnique({
            where: {
                id: id
            }
        });
        
        if (!hub) {
            return c.json({ message: "Hub not found", success: false });
        }
        
        return c.json({ hub, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.post("/", zValidator('json', hubSchema), async (c) => {
    try {
        const data = c.req.valid('json')
        await db.hub.create({
            data: data
        });

        return c.json({ message: "Hub created successfully", hubId: data.id, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.put("/:id", zValidator('json', hubSchema), async (c) => {
    try {
        const { id } = c.req.param();
        const data = c.req.valid('json')
        await db.hub.update({
            where: {
                id: id
            },
            data: data
        });

        return c.json({ message: "Hub updated successfully", success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.delete("/:id", async (c) => {
    try {
        const { id } = c.req.param();
        await db.hub.delete({
            where: {
                id: id
            }
        });

        return c.json({ message: "Hub deleted successfully", success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

export default hubRouter;