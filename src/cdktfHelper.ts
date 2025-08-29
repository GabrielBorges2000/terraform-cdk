import { App } from "cdktf";
import { PostgresStack, PostgresConfig } from "./resources/postgre-stack";
import { join } from "node:path";
import * as fs from "fs";
import { execSync } from "child_process";

export async function createPostgresStack(config: PostgresConfig) {
  const basePath = join(process.cwd(), "stacks", config.name);

  if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

  const app = new App({ outdir: basePath });
  new PostgresStack(app, `db-${config.name}`, config);
  app.synth();

  // Caminho real da stack
  const stackPath = join(basePath, "stacks", `db-${config.name}`);

  // Executa terraform no local certo
  execSync("terraform init", { cwd: stackPath, stdio: "inherit" });
  execSync("terraform apply -auto-approve", { cwd: stackPath, stdio: "inherit" });

  return stackPath;
}

export async function destroyPostgresStack(name: string) {
  const stackPath = join(process.cwd(), "stacks", name, "stacks", `db-${name}`);

  if (!fs.existsSync(stackPath)) {
    throw new Error("Stack não encontrada");
  }

  execSync("terraform destroy -auto-approve", { cwd: stackPath, stdio: "inherit" });

  return stackPath;
}
