import { Container } from '@cdktf/provider-docker/lib/container'
import { Image } from '@cdktf/provider-docker/lib/image'
import { DockerProvider } from '@cdktf/provider-docker/lib/provider'
import { Volume } from '@cdktf/provider-docker/lib/volume'
import { TerraformStack } from 'cdktf'
import type { Construct } from 'constructs'

export interface RabbitmqConfig {
  name: string
  portHostAmqp: number
  portAdminPanel: number
  username: string
  password: string
}

export class RabbitmqResource extends TerraformStack {
  constructor(scope: Construct, id: string, config: RabbitmqConfig) {
    super(scope, id)

    new DockerProvider(this, 'docker', {})

    const dockerImage = new Image(this, `RabbitmqImage_${config.name}`, {
      name: 'rabbitmq:management',
      keepLocally: true,
    })

    const rabbitmqVolume = new Volume(this, `rabbitmq_data_${config.name}`, {
      name: `rabbitmq_data_${config.name}`,
    })

    new Container(this, `rabbitmqContainer-${config.name}`, {
      name: `rabbitmq_${config.name}`,
      image: dockerImage.name,
      ports: [
        {
          internal: 5672,
          external: config.portHostAmqp,
        },
        {
          internal: 15672,
          external: config.portAdminPanel,
        },
      ],
      env: [
        `RABBITMQ_DEFAULT_USER=${config.username}`,
        `RABBITMQ_DEFAULT_PASS=${config.password}`,
      ],
      volumes: [
        {
          volumeName: rabbitmqVolume.name,
          containerPath: '/var/lib/rabbitmq/data',
        },
        {
          volumeName: './rabbitmq.conf:/etc/rabbitmq/rabbitmq.conf',
          containerPath: '/var/lib/rabbitmq/data',
        },
      ],
    })
  }
}
