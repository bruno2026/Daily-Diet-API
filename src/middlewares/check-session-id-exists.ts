import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // eslint-disable-next-line dot-notation
  const userId = request.headers['userid']
  if (!userId) {
    return reply.status(401).send({ error: 'UserId is required.' })
  }
  const result = await knex('user').where('id', userId).select('*')
  if (result.length === 0) {
    return reply.status(401).send({ error: 'UserId not found!' })
  }
  const userExists = result[0].id

  if (userExists !== userId) {
    return reply.status(401).send({ error: 'Unauthorized. UserId not found!' })
  }
}
