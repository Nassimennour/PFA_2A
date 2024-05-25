const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TypeDocument = sequelize.define("TypeDocument", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM,
    values: [
      "Financial Documents",
      "Identification Documents",
      "Legal Documents",
      "Medical Records",
      "Educational Documents",
      "Other",
    ],
    allowNull: true,
  },
  format: {
    type: DataTypes.ENUM,
    values: ["pdf", "jpeg", "png", "doc", "docx"],
    allowNull: true,
  },
  maxSize: {
    type: DataTypes.INTEGER, //  KB
    allowNull: true,
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  validityPeriod: {
    type: DataTypes.INTEGER, // in months or days, depending on the requirement
    allowNull: true,
  },
});

module.exports = (sequelize, DataTypes) => {
  return TypeDocument;
};
