const { execSync } = require("child_process");

const migrationName = process.argv[2];
if (!migrationName) {
  console.error("Please provide a migration name.");
  process.exit(1);
}

execSync(
  `npx sequelize-cli migration:generate --name create-${migrationName} --migrations-path ./src/migrations`,
  { stdio: "inherit" }
);
