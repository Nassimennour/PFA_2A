const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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
});

module.exports = DemandePret;
