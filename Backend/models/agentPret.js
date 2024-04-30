// agentPret.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Utilisateur = require("./user");
const OrganismePret = require("./organismePret");

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

AgentPret.hasOne(Utilisateur, {
  foreignKey: {
    name: "utilisateurId",
    allowNull: false,
  },
}); // an agent belongs to one user
AgentPret.belongsTo(OrganismePret, {
  foreignKey: {
    name: "organismePretId",
    allowNull: false,
  },
});

module.exports = AgentPret;
