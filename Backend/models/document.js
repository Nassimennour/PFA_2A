// models/document.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define("Document", {
  cheminFichier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nomOriginal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeFichier: {
    type: DataTypes.ENUM,
    values: ["pdf", "jpeg", "png", "doc", "docx"],
    allowNull: false,
  },
  dateTelechargement: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  taille: {
    type: DataTypes.FLOAT, //en ko
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["pending", "submitted", "verified", "rejected"],
    defaultValue: "pending",
  },
});

module.exports = (sequelize, DataTypes) => {
  return Document;
};
