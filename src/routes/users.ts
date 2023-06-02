import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
// import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createUserBodySchema.parse(request.body)

    await knex('user').insert({
      id: randomUUID(),
      name,
    })

    return reply.status(201).send()
  })
}
