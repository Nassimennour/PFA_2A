const DemandePret = require("./demandePret");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TypeDocument = require("./typeDocument");
const AgentPret = require("./agentPret");

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
  timestamps: true,
});

OrganismePret.belongsToMany(TypeDocument, {
  through: "OrganismePretTypeDocument",
});
OrganismePret.hasMany(AgentPret);
OrganismePret.hasMany(DemandePret);

module.exports = OrganismePret;
