import type { FastifyInstanceProps } from '../@types/fastify-instance'
import { createDatabase } from './database/routes/create-database'
import { destroyDatabase } from './database/routes/destroy-database'
import { getDatabase } from './database/routes/get-database'
import { getAllDatabases } from './database/routes/get-databases'

export default function registerRoutes(app: FastifyInstanceProps) {
  // DATABASE
  app.register(getDatabase)
  app.register(getAllDatabases)
  app.register(createDatabase)
  app.register(destroyDatabase)
  // DATABASE
}
