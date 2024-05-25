const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Courtier = sequelize.define("Courtier", {
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
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entreprise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  phone: {
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
});

module.exports = (sequelize, DataTypes) => {
  return Courtier;
};
