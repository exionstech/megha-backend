import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { referenceSchema } from "../schema";
import { checkBearerAuth } from "../middleware/middleware";
import { BulkReferenceGenerator } from "../../lib/reference-numbers";
import { Environment } from "../binding";
import { initDbConnect } from "../db";
import { hubs, referenceNumbers } from "../db/schema";
import { eq } from "drizzle-orm";

const refRouter = new Hono<Environment>();

refRouter.use('/*', checkBearerAuth);

refRouter.post("/", zValidator('json', referenceSchema), async (c) => {
    const db = initDbConnect(c.env.DB);
    try {
        const { id, hubId } = c.req.valid('json')
        let prefix: string = "MEXDEL";
        let generator: any;

        const ref = await db.select().from(referenceNumbers).where(eq(referenceNumbers.id, id)).get();

        if (!ref) {
            let start: number = 1;
            let end: number = 100;

            generator = new BulkReferenceGenerator(prefix, start, end).generateBulkReferences();

            await db.insert(referenceNumbers).values({
                id: id,
                prefix: prefix,
                start: start.toString(),
                end: end.toString()
            })

            await db.update(hubs).set({
                referencenos: generator.references,
            }).where(eq(hubs.id, hubId));

            return c.json({ message: "Reference created successfully", reference: generator.references, success: true });
        } else {
            let start: number = parseInt(ref.end) + 1;
            let end: number = parseInt(ref.end) + 100;

            generator = new BulkReferenceGenerator(prefix, start, end).generateBulkReferences();

            await db.update(referenceNumbers).set({
                prefix: prefix,
                start: start.toString(),
                end: end.toString()
            }).where(eq(referenceNumbers.id, id));


            await db.update(hubs).set({
                referencenos: generator.references,
            }).where(eq(hubs.id, hubId));

            return c.json({ message: "Reference Numbers updated successfully", reference: generator.references, success: true });
        }
    } catch (error) {
        console.log(error)
        return c.json({ error: error, success: false });
    }
});

export default refRouter;