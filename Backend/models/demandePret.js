// models/demandePret.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DemandePret = sequelize.define("DemandePret", {
  montant: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  dateSoumission: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  judgment: {
    type: DataTypes.ENUM,
    values: ["accepted", "rejected", "pending"],
    defaultValue: "pending",
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = (sequelize, DataTypes) => {
  return DemandePret;
};
