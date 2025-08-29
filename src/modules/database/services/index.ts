import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import { join } from 'node:path'
import { App } from 'cdktf'
import { AlreadyExistsError } from '../../_errors/already-exists-error'
import { NotFoundError } from '../../_errors/not-found-error'
import {
  type PostgresConfig,
  PostgresqlResource,
} from '../../resources/postgresql'
import type { DatabaseRepository } from '../repository'

export class DatabaseService {
  constructor(readonly repository: DatabaseRepository) { }

  async getAll() {
    return await this.repository.getAll()
  }

  async getById(databaseId: string) {
    const database = await this.repository.getById(databaseId)

    if (!database) {
      throw new NotFoundError('Database Not Found!')
    }

    return database
  }

  async createPostgresStack(config: PostgresConfig) {
    const databaseExistys = await this.repository.findByName(config.name)

    if (databaseExistys) {
      throw new AlreadyExistsError('Database already exists')
    }

    const basePath = join(process.cwd(), 'stacks', config.name)
    const existsFileStack = fs.existsSync(basePath)

    if (!existsFileStack) {
      fs.mkdirSync(basePath, { recursive: true })
    }

    const app = new App({ outdir: basePath })
    new PostgresqlResource(app, `database_${config.name}`, config)
    app.synth()

    const stackPath = this.getStackPath(basePath, config.name)

    execSync('terraform init', { cwd: stackPath, stdio: 'inherit' })
    execSync('terraform apply -auto-approve', {
      cwd: stackPath,
      stdio: 'inherit',
    })

    const database = await this.repository.create({
      name: config.name,
      port: config.port,
      password: config.password,
      username: config.username,
      path: basePath,
    })

    return {
      stackPath,
      databaseId: database.id,
    }
  }

  async destroyPostgresStack(databaseId: string) {
    const database = await this.repository.getById(databaseId)

    if (!database) {
      throw new NotFoundError('Database Not Found!')
    }

    const stackPath = this.getStackPath(database.path, database.name)

    const existsFileStack = fs.existsSync(stackPath)

    if (!existsFileStack) {
      throw new NotFoundError('Database Stack Not Found!')
    }

    execSync('terraform destroy -auto-approve', {
      cwd: stackPath,
      stdio: 'inherit',
    })

    await this.repository.delete(databaseId)

    return stackPath
  }

  private getStackPath(basePath: string, name: string) {
    return join(basePath, 'stacks', `database_${name}`)
  }
}
