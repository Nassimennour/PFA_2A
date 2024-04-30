// Importer Sequelize
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Utilisateur = sequelize.define("Utilisateur", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: {
        args: [/^\d{9,10}$/],
        msg: "Phone number must be between 9 and 10 digits.",
      },
      notContains: {
        args: [" "],
        msg: "Phone number must not contain spaces.",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  mot_de_passe: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("CLIENT", "COURTIER", "AGENT_PRET", "ADMIN"),
    allowNull: false,
  },

  timestamps: true,
});

module.exports = Utilisateur;
