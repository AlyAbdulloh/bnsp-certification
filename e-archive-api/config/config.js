const dotenv = require("dotenv");
const path = require("path");

const args = process.argv.slice(1);
const envArg =
  args.find((arg) => arg.startsWith("--env="))?.split("=")[1] ||
  "../env/.env.dev"; // Default to '../env/.env.dev'

// Load environment variables from the specified .env file
dotenv.config({ path: path.join(__dirname, envArg) });

module.exports = {
  trial_express: {
    username: process.env.MYSQL_EXAMPLE_USER,
    password: process.env.MYSQL_EXAMPLE_PASS || "",
    database: "migration_test",
    host: process.env.MYSQL_EXAMPLE_HOST,
    dialect: "mysql",
    port: process.env.MYSQL_EXAMPLE_PORT,
  },
};
