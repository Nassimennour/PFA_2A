// courtier.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Utilisateur = require("./user");
const DemandePret = require("./demandePret");
const Note = require("./note");
const {
  Client,
  ClientCourtierDemandePret,
} = require("./clientCourtierDemandePret");

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

Courtier.hasMany(DemandePret, {
  foreignKey: {
    name: "courtierId",
    allowNull: true,
  },
});
Courtier.hasOne(Utilisateur, {
  foreignKey: {
    name: "utilisateurId",
    allowNull: false,
  },
});

Courtier.hasMany(Note, {
  foreignKey: {
    name: "courtierId",
    allowNull: false,
  },
});
Courtier.belongsToMany(Client, { through: ClientCourtierDemandePret });

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
