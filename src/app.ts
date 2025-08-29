import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { jwtSetup } from './lib/jwt'
import { swaggerSetup } from './lib/swagger'
import registerRoutes from './modules'
import { errorHandler } from './modules/_errors/error-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

swaggerSetup(app)

jwtSetup(app)

app.register(fastifyCors)

registerRoutes(app)

export { app }
