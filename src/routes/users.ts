import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-session-id-exists'
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
  app.get(
    '/metricas',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      // eslint-disable-next-line dot-notation
      const id = request.headers['userid']

      // Quantidade total de refeições registradas
      const meals = await knex('refeicao')
        .count()
        .select('user', 'nome')
        .where('user', id)
      const countMeals = meals[0]['count(*)']

      // Quantidade total de refeições dentro da dieta
      const refeicoesInDieta = await knex('refeicao')
        .count()
        .select('user', 'nome')
        .where('user', id)
        .andWhere('esta_na_dieta', 1)
      const countinDieta = refeicoesInDieta[0]['count(*)']

      // Quantidade total de refeições fora da dieta
      const refeicoesOutDieta = await knex('refeicao')
        .count()
        .select('user', 'nome')
        .where('user', id)
        .andWhere('esta_na_dieta', 0)
      const countOutDieta = refeicoesOutDieta[0]['count(*)']

      // Melhor sequência por dia de refeições dentro da dieta
      const sequenciaDePratos = await knex('refeicao')
        .count()
        .select('user', 'data_hora', 'nome', 'esta_na_dieta')
        .where('user', id)
        .groupBy('data_hora', 'nome')
        .orderBy('data_hora', 'asc')
        .orderBy('nome', 'asc')
      const dietCounts = {}
      sequenciaDePratos.forEach((meal) => {
        if (meal.esta_na_dieta) {
          const date = meal.data_hora.toString().split(' ')[0]
          dietCounts[date] = meal['count(*)']
        }
      })
      let bestCount = 0
      Object.entries(dietCounts).forEach(([date, count]) => {
        if (count > bestCount) {
          bestCount = count
        }
      })

      return reply.send({
        mealsCount: countMeals,
        inDietaCount: countinDieta,
        outDietaCount: countOutDieta,
        melhorSequencia: bestCount,
      })
    },
  )
}
