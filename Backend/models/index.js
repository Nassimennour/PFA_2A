const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const db = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== "index.js" &&
      file.slice(-3) === ".js" &&
      file !== "associations.js"
  )
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, file));
    const model = modelDefiner(sequelize, DataTypes);
    db[model.name] = model;
  });

// Define associations
const associateModels = require("./associations");
associateModels(db);

// Export models and Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
