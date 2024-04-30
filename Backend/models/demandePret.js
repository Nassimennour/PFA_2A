const BienImmobilier = require("./bienImmobilier");
const Courtier = require("./courtier");
const DossierPret = require("./dossierPret");
const OrganismePret = require("./organismePret");
const Utilisateur = require("./user");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Client = require("./client");
const { ClientCourtierDemandePret } = require("./clientCourtierDemandePret");

const DemandePret = sequelize.define("DemandePret", {
  dateDemande: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  etat: {
    type: DataTypes.ENUM,
    values: ["enAttente", "acceptee", "refusee"],
    allowNull: false,
    defaultValue: "enAttente",
  },
  montant: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tauxInteret: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  timestamps: true,
});
DemandePret.belongsTo(BienImmobilier, {
  foreignKey: "bienImmobilierId",
});

DemandePret.hasOne(DossierPret);
DemandePret.belongsTo(OrganismePret, {
  foreignKey: "organismePretId",
});
DemandePret.belongsTo(Client, {
  foreignKey: "clientId",
});
DemandePret.belongsTo(Courtier, {
  foreignKey: "courtierId",
  allowNull: true,
});

DemandePret.belongsToMany(Client, { through: ClientCourtierDemandePret });
DemandePret.belongsToMany(Courtier, { through: ClientCourtierDemandePret });

module.exports = DemandePret;
