const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Client = sequelize.define("Client", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: {
        args: [/^\d{9,10}$/],
        msg: "Phone number must be between 9 and 10 digits.",
      },
      notContains: {
        args: [" "],
        msg: "Phone number must not contain spaces.",
      },
    },
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateNaissance: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM,
    values: ["male", "female"],
    allowNull: false,
  },
});

module.exports = (sequelize, DataTypes) => {
  return Client;
};
