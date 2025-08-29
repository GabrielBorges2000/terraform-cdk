import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DatabaseRepository } from '../repository'
import { DatabaseService } from '../services'

export async function getAllDatabases(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/databases',
    {
      schema: {
        tags: ['Database'],
        summary: 'getAll databases',
        response: {
          200: z.object({
            databases: z.array(
              z.object({
                id: z.uuid(),
                name: z.string(),
                port: z.number(),
                path: z.string(),
                username: z.string(),
                password: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
              })
            ),
          }),
        },
      },
    },
    async (_, reply) => {
      const databaseRepository = new DatabaseRepository()
      const databaseService = new DatabaseService(databaseRepository)

      const databases = await databaseService.getAll()

      return reply.status(200).send({
        databases,
      })
    }
  )
}
