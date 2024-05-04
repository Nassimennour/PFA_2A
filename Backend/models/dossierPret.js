const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DossierPret = sequelize.define("DossierPret", {
  salary: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  totalExpenses: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  rent: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  utilities: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  groceries: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  transportation: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  additionalIncome: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  totalAssets: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  totalLiabilities: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  creditHistory: {
    type: DataTypes.ENUM,
    values: ["Excellent", "Good", "Fair", "Poor"],
    allowNull: true,
  },
  employmentStatus: {
    type: DataTypes.ENUM,
    values: [
      "Employed",
      "Unemployed",
      "Self-employed",
      "Retired",
      "Student",
      "Other",
    ],
    allowNull: true,
  },
  cheminDossier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = (sequelize, DataTypes) => {
  return DossierPret;
};
