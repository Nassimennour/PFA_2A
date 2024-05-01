const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const DossierPret = require("./dossierPret");
const DemandePret = require("./demandePret");

const Client = sequelize.define("Client", {});
// Add this method to your Client model
Client.prototype.getDernierDossier = async function () {
  const dernierDossier = await DossierPret.findOne({
    include: [
      {
        model: DemandePret,
        include: [
          {
            model: Client,
          },
        ],
      },
    ],
    order: [[DemandePret, "createdAt", "DESC"]],
    where: { "$DemandePret.Client.id$": this.id },
  });

  return dernierDossier;
};
module.exports = Client;
