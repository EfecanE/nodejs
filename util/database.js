const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "nodecomplete", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
