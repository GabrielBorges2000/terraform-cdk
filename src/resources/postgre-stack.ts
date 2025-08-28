import { Construct } from "constructs";
import { TerraformStack } from "cdktf";
import { DockerProvider } from "@cdktf/provider-docker/lib/provider";
import { Image } from "@cdktf/provider-docker/lib/image";
import { Container } from "@cdktf/provider-docker/lib/container";
import { Volume } from "@cdktf/provider-docker/lib/volume";

export interface PostgresConfig {
  name: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class PostgresStack extends TerraformStack {
  constructor(scope: Construct, id: string, config: PostgresConfig) {
    super(scope, id);

    new DockerProvider(this, "docker", {});

    const dockerImage = new Image(this, `PostgresImage-${config.name}`, {
      name: "postgres:latest", 
      keepLocally: true,
    });

    const pgVolume = new Volume(this, `pgdata-${config.name}`, {
      name: `pgdata_${config.name}`,
    });

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
        `POSTGRES_USER=${config.user}`,
        `POSTGRES_PASSWORD=${config.password}`,
        `POSTGRES_DB=${config.database}`,
      ],
      volumes: [
        {
          volumeName: pgVolume.name,
          containerPath: "/var/lib/postgresql/data",
        },
      ],
    });
  }
}
