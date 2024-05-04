const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("creditDB", "postgres", "password123", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
