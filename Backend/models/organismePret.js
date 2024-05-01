const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrganismePret = sequelize.define("OrganismePret", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  siteWeb: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = OrganismePret;
