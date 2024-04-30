const DemandePret = require("./demandePret");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DossierPret = sequelize.define("DossierPret", {
  salaire: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      isFloat: true,
    },
  },
  dépenses: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  dateSoumission: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  cheminDossier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamps: true,
});

DossierPret.belongsTo(DemandePret, {
  foreignKey: {
    name: "demandePretId",
    allowNull: false,
  },
});

module.exports = DossierPret;
