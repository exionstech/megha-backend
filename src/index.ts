import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRouter from './routers/user-router'
import hubRouter from './routers/hub-router'
import authRouter from './routers/auth-router'
import { checkBearerAuth } from './middleware/middleware'
import refRouter from './routers/reference-router'

const app = new Hono().basePath('/api')

app.use('/api/*', cors({
  origin: '*'
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', authRouter)
app.route('/user', userRouter)
app.route('/hub', hubRouter)
app.route('/generate', refRouter)

export default app
