import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { referenceSchema } from "../schema";
import { db } from "../../lib/db";
import { checkBearerAuth } from "../middleware/middleware";
import { BulkReferenceGenerator } from "../../lib/reference-numbers";

const refRouter = new Hono();
refRouter.use('/*', checkBearerAuth);

refRouter.post("/", zValidator('json', referenceSchema), async (c) => {
    try {
        const { id, hubId } = c.req.valid('json')
        let prefix: string = "MEXDEL";
        let generator: any;
        
        const ref = await db.referenceNo.findFirst();

        if (!ref) {
            let start: number = 1;
            let end: number = 100;

            generator = new BulkReferenceGenerator(prefix, start, end).generateBulkReferences();

            await db.referenceNo.create({
                data: {
                    id: id,
                    prefix: prefix,
                    start: start.toString(),
                    end: end.toString()
                }
            })

            await db.hub.update({
                where: {
                    id: hubId
                },
                data: {
                    referencenos: generator.references
                }
            })
        } else {
            let start: number = parseInt(ref.end) + 1;
            let end: number = parseInt(ref.end) + 100;

            generator = new BulkReferenceGenerator(prefix, start, end).generateBulkReferences();

            await db.referenceNo.update({
                where: {
                    id: id
                },
                data: {
                    prefix: prefix,
                    start: start.toString(),
                    end: end.toString()
                }
            })

            await db.hub.update({
                where: {
                    id: hubId
                },
                data: {
                    referencenos: generator.references
                }
            })
        }

        return c.json({ message: "Reference created successfully", reference: generator.references, success: true });
    } catch (error) {
        console.log(error)
        return c.json({ error: error, success: false });
    }
});

export default refRouter;