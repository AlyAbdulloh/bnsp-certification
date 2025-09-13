# Template API

This Project Framework created by NRK (nkusworo@aio.co.id) is ready to use as base API service for another project.

## Installation

1. Extract zip
2. cd path/to/project_folder
3. npm install
4. Setup the env first before using it, create new file .env.dev or env.prod based on env.example
5. npm run models to generate models using Sequelize Auto (Setup required in ./config/sequelizeAuto.js based on env setup)
6. npm run dev / npm run prod to run it
7. npm run create-migration "name-table" to create migration
8. npm run migrate:dev / migrate:prod to generate/create table from migration
9. npm run migrate-undo to rollback migration 
10. npm run migrate-undo:all to rollback all migration
