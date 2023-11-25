const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "EfecanEfe25.", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
