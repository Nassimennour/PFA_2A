const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

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

module.exports = Note;
