// models/demandePret.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DemandePret = sequelize.define("DemandePret", {
  montant: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  interestRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  dateSoumission: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
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
