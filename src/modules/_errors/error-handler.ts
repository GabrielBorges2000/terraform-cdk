import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { AlreadyExistsError } from './already-exists-error'
import { BadRequestError } from './bad-request-error'
import { NotFoundError } from './not-found-error'
import { UnauthorizedError } from './unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Validation error',
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    reply.status(401).send({
      message: error.message,
    })
  }

  if (error instanceof NotFoundError) {
    reply.status(404).send({
      message: error.message,
    })
  }

  if (error instanceof AlreadyExistsError) {
    reply.status(409).send({
      message: error.message,
    })
  }

  console.error(error)

  // send error to some observability platform

  reply.status(500).send({ message: 'Internal server error' })
}
