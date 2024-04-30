const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Client = require("./client");
const Courtier = require("./courtier");

const Note = sequelize.define("Note", {
  note: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      max: 5,
    },
  },
  commentaire: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Note.belongsTo(Client, {
  foreignKey: {
    name: "clientId",
    allowNull: false,
  },
});

Note.belongsTo(Courtier, {
  foreignKey: {
    name: "courtierId",
    allowNull: false,
  },
});

module.exports = Note;
