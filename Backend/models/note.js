// models/note.js
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
    type: DataTypes.DATE, //YYYY-MM-DD
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = (sequelize, DataTypes) => {
  return Note;
};
