import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import scalar from '@scalar/fastify-api-reference'
import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  jsonSchemaTransform,
  jsonSchemaTransformObject,
} from 'fastify-type-provider-zod'
import type { FastifyInstanceProps } from '../@types/fastify-instance'

export async function swaggerSetup(app: FastifyInstanceProps) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API GERENCIADO DE EVENTOS',
        version: '1.0.0',
        contact: {
          email: 'contato@codeborges.com',
          name: 'Gabriel Borges | CODEBORGE',
          url: 'https://portfolio.codeborges.com.br/',
        },
        description: 'API documentation',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  })

  async function authenticateDocs(req: FastifyRequest, reply: FastifyReply) {
    const authHeader = req.headers.authorization
    const validUser = 'admin'
    const validPassword = 'admin'

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      reply.header('WWW-Authenticate', 'Basic')
      reply.header('Cache-Control', 'no-cache') // Garante que a autenticação será pedida novamente
      return reply.status(401).send('Unauthorized')
    }

    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8'
    )
    const [username, password] = credentials.split(':')

    if (username !== validUser || password !== validPassword) {
      reply.header('Cache-Control', 'no-cache') // Garante que a autenticação será pedida novamente
      return reply.status(401).send('Unauthorized')
    }
  }

  app.register(fastifySwaggerUI, {
    routePrefix: '/api-docs',
    uiHooks: {
      preHandler: authenticateDocs,
    },
    theme: {
      title: 'API GERENCIADO DE EVENTOS',
    },
    uiConfig: {
      filter: true,
      displayRequestDuration: true,
    },
  })

  //@ts-ignore
  await app.register(scalar, {
    routePrefix: '/docs',
    uiHooks: {
      preHandler: authenticateDocs,
    },
    theme: {
      title: 'API GERENCIADO DE EVENTOS',
    },
    uiConfig: {
      filter: true,
      displayRequestDuration: true,
    },
  })
}
