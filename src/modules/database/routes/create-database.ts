import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { DatabaseRepository } from '../repository'
import { DatabaseService } from '../services'

export async function createDatabase(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/databases',
    {
      schema: {
        tags: ['Database'],
        summary: 'Create a new database',
        body: z.object({
          name: z.string(),
          port: z.coerce.number(),
          username: z.string(),
          password: z.string().min(6),
          database: z.string(),
        }),
        response: {
          201: z.object({
            message: z.string(),
            databaseId: z.uuid(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, username, password, database, port } = request.body

      const databaseRepository = new DatabaseRepository()
      const databaseService = new DatabaseService(databaseRepository)

      const { databaseId } = await databaseService.createPostgresStack({
        name,
        username,
        password,
        database,
        port,
      })

      return reply.status(201).send({
        message: 'Database created!',
        databaseId,
      })
    }
  )
}
