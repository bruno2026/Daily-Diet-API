/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-session-id-exists'

export async function refeicaoRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const createRefeicaoBodySchema = z.object({
      nome: z.string(),
      descricao: z.string(),
      data_hora: z.string(),
      esta_na_dieta: z.boolean(),
    })
    // eslint-disable-next-line dot-notation
    const userid = request.headers['userid']

    const { nome, descricao, data_hora, esta_na_dieta } =
      createRefeicaoBodySchema.parse(request.body)

    await knex('refeicao').insert({
      id: randomUUID(),
      nome,
      descricao,
      data_hora,
      esta_na_dieta,
      user: userid,
    })

    return reply.status(201).send()
  })
}
