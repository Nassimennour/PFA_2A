const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const OrganismePret = require("./organismePret");

const TypeDocument = sequelize.define("TypeDocument", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  format: {
    type: DataTypes.ENUM,
    values: ["pdf", "jpeg", "png", "doc", "docx"],
    allowNull: true,
  },
  maxSize: {
    type: DataTypes.INTEGER, // en Ko
    allowNull: true,
  },
  timestamps: true,
});

TypeDocument.belongsToMany(OrganismePret, {
  through: "OrganismePretTypeDocument",
});

module.exports = TypeDocument;
