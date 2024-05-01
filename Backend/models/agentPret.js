// agentPret.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AgentPret = sequelize.define("AgentPret", {
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
  note: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 5,
    },
  },
});

module.exports = AgentPret;
