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
      esta_na_dieta: z.boolean(),
    })
    // eslint-disable-next-line dot-notation
    const userid = request.headers['userid']

    const { nome, descricao, esta_na_dieta } = createRefeicaoBodySchema.parse(
      request.body,
    )
    const now = new Date()
    // Formata a data no formato 'dd/mm/yyyy hh:mm:ss'
    const formattedDate = now.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })

    await knex('refeicao').insert({
      id: randomUUID(),
      nome,
      descricao,
      data_hora: formattedDate,
      esta_na_dieta,
      user: userid,
    })

    return reply.status(201).send()
  })
  // Listar todas as refeicoes
  app.get('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    // eslint-disable-next-line dot-notation
    const userid = request.headers['userid']

    const meals = await knex('refeicao').where('user', userid).select('*')

    return reply.status(200).send(meals)
  })
  // Listar uma unica refeicao
  app.get(
    '/:idRefeicao',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const { idRefeicao } = request.query
      const userId = request.headers.userid

      // Verifica se a refeição existe
      const meal = await knex('refeicao').where('id', idRefeicao).select('*')
      if (meal.length === 0) {
        return reply.status(200).send({ meal: [] })
      }
      // Verifica se o usuário tem permissão para listar a refeição
      const mealUserId = meal[0].user
      if (mealUserId !== userId) {
        return reply.status(406).send('Permission Denied, user not permitted.')
      }

      return reply.status(200).send(meal)
    },
  )
  // Deve ser possivel editar uma refeicao
  app.patch(
    '/:idRefeicao',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const createRefeicaoBodySchema = z.object({
        nome: z.string(),
        descricao: z.string(),
        // data_hora: z.string(),
        esta_na_dieta: z.boolean(),
      })
      try {
        const userId = request.headers.userid
        const { idRefeicao } = request.query

        // Verifica se a refeição existe
        const meal = await knex('refeicao').where('id', idRefeicao).select('*')
        if (meal.length === 0) {
          return reply.status(200).send({ meal: [] })
        }
        // Verifica se o usuário tem permissão para editar a refeição
        const mealUserId = meal[0].user
        if (mealUserId !== userId) {
          return reply
            .status(406)
            .send('Permission Denied, user not permitted.')
        }
        const { nome, descricao, esta_na_dieta } =
          createRefeicaoBodySchema.parse(request.body)
        // alterar a refeição
        const now = new Date()
        // Formata a data no formato 'dd/mm/yyyy hh:mm:ss'
        const formattedDate = now.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
        await knex('refeicao').where('id', idRefeicao).update({
          nome,
          descricao,
          data_hora: formattedDate,
          esta_na_dieta,
        })

        return reply.status(204).send()
      } catch (error) {
        // Handle error
        return reply.status(500).send('Internal Server Error')
      }
    },
  )
  // Deve ser possivel apagar uma refeicao
  app.put(
    '/:idRefeicao',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      try {
        const userId = request.headers.userid
        const { idRefeicao } = request.query

        // Verifica se a refeição existe
        const meal = await knex('refeicao').where('id', idRefeicao).select('*')
        if (meal.length === 0) {
          return reply.status(200).send({ meal: [] })
        }
        // Verifica se o usuário tem permissão para deletar a refeição
        const mealUserId = meal[0].user
        if (mealUserId !== userId) {
          return reply
            .status(406)
            .send('Permission Denied, user not permitted.')
        }
        // Deleta a refeição
        await knex('refeicao').where('id', idRefeicao).delete()
        return reply.status(204).send()
      } catch (error) {
        // Handle error
        return reply.status(500).send('Internal Server Error')
      }
    },
  )
}
