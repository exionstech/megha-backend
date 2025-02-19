import { env } from "hono/adapter"
import { HTTPException } from "hono/http-exception"
import { verify } from "hono/jwt";

export const checkBearerAuth = async (c: any, next: any) => {
    const { SECRET } = env<{ SECRET: string }>(c);
    const authHeader = c.req.header('Authorization')

    if (!authHeader) {
        throw new HTTPException(401, { message: 'Authorization header missing' })
    }

    if (!authHeader.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: 'Invalid authorization format' })
    }

    const token = authHeader.split(' ')[1]
    
    const decoded = await verify(token, SECRET)
    
    if (!decoded || decoded.exp! < Math.floor(Date.now() / 1000)) {
        throw new HTTPException(403, { message: 'Invalid token' })
    }

    await next()
}