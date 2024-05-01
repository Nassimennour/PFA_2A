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
  },
});

const Photo = sequelize.define("Photo", {
  chemin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dimension: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = { BienImmobilier, Photo };
