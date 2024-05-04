// models/bienImmobilier.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BienImmobilier = sequelize.define("BienImmobilier", {
  typeBien: {
    type: DataTypes.ENUM,
    values: ["maison", "appartement", "terrain", "autre"],
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  superficie: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  nbPieces: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  valeur: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
});

module.exports = (sequelize, DataTypes) => {
  return BienImmobilier;
};
