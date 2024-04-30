const DossierPret = require("./dossierPret");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Document = sequelize.define("Document", {
  cheminFichier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomOriginal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeFichier: {
    type: DataTypes.ENUM,
    values: ["pdf", "jpeg", "png", "doc", "docx"],
    allowNull: false,
  },
  dateTelechargement: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  taille: {
    // en Ko
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamps: true,
});

Document.belongsTo(TypeDocument);
Document.belongsTo(DossierPret);

module.exports = Document;
