import { Hono } from 'hono'
import userRouter from './routers/user-router'

const app = new Hono().basePath('/api')

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/user', userRouter)

export default app
