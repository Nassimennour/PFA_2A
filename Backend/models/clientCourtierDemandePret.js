const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Courtier = require("./courtier");
const DemandePret = require("./demandePret");
const Client = require("./client");

const ClientCourtierDemandePret = sequelize.define(
  "ClientCourtierDemandePret",
  {
    clientId: {
      type: DataTypes.INTEGER,
      references: {
        model: Client,
        key: "id",
      },
    },
    courtierId: {
      type: DataTypes.INTEGER,
      references: {
        model: Courtier,
        key: "id",
      },
    },
    demandePretId: {
      type: DataTypes.INTEGER,
      references: {
        model: DemandePret,
        key: "id",
      },
    },
  }
);

module.exports = { ClientCourtierDemandePret };
