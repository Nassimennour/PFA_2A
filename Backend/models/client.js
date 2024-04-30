const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Utilisateur = require("./user");
const DemandePret = require("./demandePret");
const Courtier = require("./courtier");
const { ClientCourtierDemandePret } = require("./clientCourtierDemandePret");

const Client = sequelize.define("Client", {
  dernierDossier: {
    type: DataTypes.INTEGER,
    references: {
      model: "DossierPret", // name of Target model
      key: "id", // key in Target model that we're referencing
    },
  },
});

Client.hasMany(DemandePret, {
  foreignKey: {
    name: "clientId",
    allowNull: false,
  },
});
Client.hasOne(Utilisateur, {
  foreignKey: {
    name: "utilisateurId",
    allowNull: false,
  },
});

Client.belongsToMany(Courtier, { through: ClientCourtierDemandePret });

module.exports = Client;
