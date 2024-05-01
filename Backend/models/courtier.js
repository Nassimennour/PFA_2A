// courtier.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Note = require("./note");

const Courtier = sequelize.define("Courtier", {
  entreprise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Courtier.prototype.getAverageRating = async function () {
  const notes = await Note.findAll({
    where: { courtierId: this.id },
    attributes: [[sequelize.fn("AVG", sequelize.col("note")), "noteMoyenne"]],
  });

  return notes && notes.length > 0
    ? notes[0].getDataValue("noteMoyenne")
    : null;
};

module.exports = Courtier;
