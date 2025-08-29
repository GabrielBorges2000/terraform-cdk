import { Container } from '@cdktf/provider-docker/lib/container'
import { Image } from '@cdktf/provider-docker/lib/image'
import { DockerProvider } from '@cdktf/provider-docker/lib/provider'
import { Volume } from '@cdktf/provider-docker/lib/volume'
import { TerraformStack } from 'cdktf'
import type { Construct } from 'constructs'

export interface PostgresConfig {
  name: string
  port: number
  username: string
  password: string
  database: string
  path?: string
}

export class PostgresqlResource extends TerraformStack {
  constructor(scope: Construct, id: string, config: PostgresConfig) {
    super(scope, id)

    new DockerProvider(this, 'docker', {})

    const dockerImage = new Image(this, `PostgresImage-${config.name}`, {
      name: 'postgres:latest',
      keepLocally: true,
    })

    const pgVolume = new Volume(this, `pgdata-${config.name}`, {
      name: `pgdata_${config.name}`,
    })

    new Container(this, `postgresContainer-${config.name}`, {
      name: `postgres-${config.name}`,
      image: dockerImage.name,
      ports: [
        {
          internal: 5432,
          external: config.port,
        },
      ],
      env: [
        `POSTGRES_USER=${config.username}`,
        `POSTGRES_PASSWORD=${config.password}`,
        `POSTGRES_DB=${config.database}`,
      ],
      volumes: [
        {
          volumeName: pgVolume.name,
          containerPath: '/var/lib/postgresql/data',
        },
      ],
    })
  }
}
