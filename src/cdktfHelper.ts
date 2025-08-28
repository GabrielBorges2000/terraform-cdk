import { App } from "cdktf";
import { PostgresStack, PostgresConfig } from "./resources/postgre-stack";
import { execSync } from "child_process";
import * as fs from "fs";
import { join } from "node:path";

export function createPostgresStack(config: PostgresConfig) {
  const stackPath = join(process.cwd(), "stacks", config.name);

  if (!fs.existsSync(stackPath)) fs.mkdirSync(stackPath, { recursive: true });

  const app = new App({ outdir: stackPath });
  new PostgresStack(app, `db-${config.name}`, config);
  app.synth();

  // Deploy via cdktf CLI
  execSync("cdktf deploy --auto-approve", { cwd: stackPath, stdio: "inherit" });

  return stackPath;
}

export function destroyPostgresStack(name: string) {
  const stackPath = join(process.cwd(), "stacks", name);

  if (!fs.existsSync(stackPath)) {
    throw new Error("Stack não encontrada");
  }

  // Destroy via cdktf CLI
  execSync("cdktf destroy --auto-approve", { cwd: stackPath, stdio: "inherit" });
  return stackPath;
}
