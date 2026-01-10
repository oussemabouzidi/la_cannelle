import '../src/env';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

function getFlagValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) return undefined;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('-')) return undefined;
  return value;
}

function getFirstPositionalArg(): string | undefined {
  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith('-')) return arg;
  }
  return undefined;
}

async function main() {
  const schemaPath = path.resolve(__dirname, 'schema.prisma');
  const defaultSqlPath = path.resolve(__dirname, '../../backup.sql');

  const sqlPath =
    process.env.BACKUP_SQL_PATH ||
    getFlagValue('--file') ||
    getFirstPositionalArg() ||
    defaultSqlPath;

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Prisma schema not found at: ${schemaPath}`);
  }

  if (!fs.existsSync(sqlPath)) {
    throw new Error(
      `SQL backup file not found at: ${sqlPath}\n` +
        `Provide a path via \`BACKUP_SQL_PATH\` or \`--file <path>\`.`,
    );
  }

  const prismaCliPath = require.resolve('prisma/build/index.js');

  const originalSql = fs.readFileSync(sqlPath, 'utf8');
  const sanitizedSqlLines = originalSql
    .split(/\r?\n/)
    .filter((line) => !line.includes('SET character_set_client = @saved_cs_client'));
  const sanitizedSql = sanitizedSqlLines.join('\n');

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'la-cannelle-seed-'));
  const tempSqlPath = path.join(tempDir, path.basename(sqlPath));
  fs.writeFileSync(tempSqlPath, sanitizedSql, 'utf8');

  if (sanitizedSqlLines.length !== originalSql.split(/\r?\n/).length) {
    console.log('Note: sanitized SQL dump to remove incompatible session directives.');
  }

  console.log(`Restoring MySQL data from: ${sqlPath}`);
  console.log(`Using Prisma schema: ${schemaPath}`);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [prismaCliPath, 'db', 'execute', '--schema', schemaPath, '--file', tempSqlPath],
      {
        stdio: 'inherit',
        env: process.env,
      },
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      reject(new Error(`Restore failed (exit code ${code ?? 'unknown'})`));
    });
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
