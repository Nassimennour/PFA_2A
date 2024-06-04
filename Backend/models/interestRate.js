const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const InterestRate = sequelize.define(
  "InterestRate",
  {
    duree: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["10", "15", "20", "25", "30", "more"]],
      },
    },
    interestRate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = (sequelize, DataTypes) => {
  return InterestRate;
};
