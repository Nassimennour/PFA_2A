const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AgentPret = sequelize.define("AgentPret", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
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

  numLicence: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anneesExperience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  diplome: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = (sequelize, DataTypes) => {
  return AgentPret;
};
