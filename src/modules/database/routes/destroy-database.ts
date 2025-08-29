import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DatabaseRepository } from '../repository'
import { DatabaseService } from '../services'

export async function destroyDatabase(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/databases/:databaseId',
    {
      schema: {
        tags: ['Database'],
        summary: 'Destroy database',
        params: z.object({
          databaseId: z.uuid(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            stackPath: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { databaseId } = request.params

      const databaseRepository = new DatabaseRepository()
      const databaseService = new DatabaseService(databaseRepository)

      const stackPath = await databaseService.destroyPostgresStack(databaseId)

      return reply.status(201).send({
        message: 'Database destroy!',
        stackPath,
      })
    }
  )
}
