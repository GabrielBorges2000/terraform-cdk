import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DatabaseRepository } from '../repository'
import { DatabaseService } from '../services'

export async function getDatabase(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/databases/:databaseId',
    {
      schema: {
        tags: ['Database'],
        summary: 'get database by id',
        params: z.object({
          databaseId: z.uuid(),
        }),
        response: {
          200: z.object({
            database: z.object({
              id: z.uuid(),
              name: z.string(),
              port: z.number(),
              path: z.string(),
              username: z.string(),
              password: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { databaseId } = request.params

      const databaseRepository = new DatabaseRepository()
      const databaseService = new DatabaseService(databaseRepository)

      const database = await databaseService.getById(databaseId)

      return reply.status(200).send({
        database,
      })
    }
  )
}
