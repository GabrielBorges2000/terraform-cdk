import fastifyJwt from '@fastify/jwt'
import type { FastifyInstanceProps } from '../@types/fastify-instance'

export async function jwtSetup(app: FastifyInstanceProps) {
  app.register(fastifyJwt, {
    secret: 'supersecret',
  })
}
