import type { Prisma } from '@prisma/client'
import { prisma } from '../../../lib/prisma'

export class DatabaseRepository {
  async getAll() {
    return await prisma.database.findMany()
  }

  async create(data: Prisma.DatabaseCreateInput) {
    const { name, password, port, username, path } = data

    return await prisma.database.create({
      data: {
        name,
        password,
        port,
        username,
        path,
      },
    })
  }

  async delete(databaseId: string) {
    return await prisma.database.delete({
      where: {
        id: databaseId,
      },
    })
  }

  async getById(databaseId: string) {
    return await prisma.database.findUnique({
      where: {
        id: databaseId,
      },
    })
  }

  async findByName(name: string) {
    return await prisma.database.findFirst({
      where: {
        name,
      },
    })
  }
}
