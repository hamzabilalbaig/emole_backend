const { Sequelize } = require("sequelize");

const Localhost = {
  host: "localhost", //"localhost",
  dialect: "postgres",
  database: "emole",
  username: "postgres",
  password: "amaso123.", //"75824",
  port: "5432",
};

const CloudwaysMySql = {
  host: "104.248.24.191", //"localhost",
  dialect: "mysql",
  database: "yyxnpfcjgk",
  username: "yyxnpfcjgk",
  password: "rRdSxg8syj", //"75824",
  port: 3306,
};

const aws = {
  host: "emoleaws.c9usuwew0zh8.eu-north-1.rds.amazonaws.com", //"localhost",
  dialect: "mysql",
  database: "emole",
  username: "admin",
  password: "emoleadmin", //"75824",
  port: 3306,
};

// const AzureServer = {
//   host: "techappdb.postgres.database.azure.com", //"localhost",
//   dialect: "postgres",
//   database: "CED",
//   username: "postgre",
//   password: "Lgf7BpxwZZeLwcj", //"75824",
//   port: "5432",
//   dialectOptions: {
//     ssl: {
//       require: true, // This will help you. But you will see nwe error
//       rejectUnauthorized: false, // This line will fix new error
//     },
//   },
// };

const sequelizeServer = new Sequelize(aws);

module.exports = {
  sequelizeServer,
};
