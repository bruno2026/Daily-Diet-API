import fastify from 'fastify'
// import cookie from '@fastify/cookie'

import { userRoutes } from './routes/users'
import { refeicaoRoutes } from './routes/refeicoes'

export const app = fastify()

// app.register(cookie)
app.register(userRoutes, {
  prefix: 'user',
})

app.register(refeicaoRoutes, {
  prefix: 'refeicao',
})
