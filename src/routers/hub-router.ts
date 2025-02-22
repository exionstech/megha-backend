import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { hubSchema } from "../schema";
import { checkBearerAuth } from "../middleware/middleware";
import { initDbConnect } from "../db";
import { Environment } from "../binding";
import { hubs } from "../db/schema";
import { eq } from "drizzle-orm";

const hubRouter = new Hono<Environment>();

hubRouter.use("/*", checkBearerAuth);

hubRouter.get("/", async (c) => {
    const db = initDbConnect(c.env.DB);
    try {
        const hubs = await db.query.hubs.findMany();

        if (!hubs) {
            return c.json({ message: "Hubs not found", success: false });
        }

        return c.json({ hubs, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.get("/:id", async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const { id } = c.req.param();
        const hub = await db.select().from(hubs).where(eq(hubs.id, id)).get();

        if (!hub) {
            return c.json({ message: "Hub not found", success: false });
        }

        return c.json({ hub, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.post("/", zValidator('json', hubSchema), async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const data = c.req.valid('json')
        await db.insert(hubs).values({
            id: data.id,
            name: data.name,
            address: data.address,
            pincode: data.pincode,
            hubAdminId: data.hubAdminId,
            kycstatus: data.kycstatus ?? false,
            kycdoc: data.kycdoc,
            kycdocurl: data.kycdocurl,
            referencenos: [],
        });

        return c.json({ message: "Hub created successfully", hubId: data.id, success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.put("/:id", zValidator('json', hubSchema), async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const { id } = c.req.param();
        const data = c.req.valid('json')

        await db.update(hubs).set({
            name: data.name,
            address: data.address,
            pincode: data.pincode,
            hubAdminId: data.hubAdminId,
            kycstatus: data.kycstatus ?? false,
            kycdoc: data.kycdoc,
            kycdocurl: data.kycdocurl,
            referencenos: [],
        }).where(eq(hubs.id, id));
        
        return c.json({ message: "Hub updated successfully", success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

hubRouter.delete("/:id", async (c) => {
    const db = initDbConnect(c.env.DB);

    try {
        const { id } = c.req.param();
        await db.delete(hubs).where(eq(hubs.id, id));

        return c.json({ message: "Hub deleted successfully", success: true });
    } catch (error) {
        return c.json({ error: error, success: false });
    }
});

export default hubRouter;