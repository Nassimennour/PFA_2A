"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const models = require(path.join(__dirname, file));
    if (typeof models === "object" && models !== null) {
      Object.values(models).forEach((model) => {
        db[model.name] = model;
      });
    } else {
      db[models.name] = models;
    }
  });

// Define relationships
Object.keys(db).forEach((modelName) => {
  switch (modelName) {
    case "Photo":
      db[modelName].belongsTo(db.BienImmobilier);
      break;
    case "BienImmobilier":
      db[modelName].hasMany(db.Photo);
      db[modelName].hasMany(db.DemandePret);
      break;
    case "Client":
      db[modelName].hasMany(db.DemandePret, {
        foreignKey: {
          name: "clientId",
          allowNull: false,
        },
      });
      db[modelName].hasOne(db.Utilisateur, {
        foreignKey: {
          name: "utilisateurId",
          allowNull: false,
        },
      });
      db[modelName].belongsToMany(db.Courtier, {
        through: "ClientCourtierDemandePret",
      });
      db[modelName].belongsToMany(db.DemandePret, {
        through: "ClientCourtierDemandePret",
      });
      break;
    case "DemandePret":
      if (db.BienImmobilier) {
        db[modelName].belongsTo(db.BienImmobilier, {
          foreignKey: "bienImmobilierId",
        });
      } else {
        console.error("BienImmobilier not found");
      }

      db[modelName].hasOne(db.DossierPret);
      if (db.OrganismePret) {
        db[modelName].belongsTo(db.OrganismePret, {
          foreignKey: "organismePretId",
        });
      } else {
        console.error("OrganismePret not found");
      }
      if (db.Client) {
        db[modelName].belongsTo(db.Client, {
          foreignKey: "clientId",
        });
      } else {
        console.error("Client not found");
      }
      if (db.Courtier) {
        db[modelName].belongsTo(db.Courtier, {
          foreignKey: "courtierId",
          allowNull: true,
        });
      } else {
        console.error("Courtier not found");
      }
      db[modelName].belongsToMany(db.Client, {
        through: "ClientCourtierDemandePret",
      });
      db[modelName].belongsToMany(db.Courtier, {
        through: "ClientCourtierDemandePret",
      });
      break;
    case "TypeDocument":
      db[modelName].belongsToMany(db.OrganismePret, {
        through: "OrganismePretTypeDocument",
      });
      break;
    case "OrganismePret":
      db[modelName].belongsToMany(db.TypeDocument, {
        through: "OrganismePretTypeDocument",
      });
      db[modelName].hasMany(db.AgentPret);
      db[modelName].hasMany(db.DemandePret);
      break;
    case "AgentPret":
      db[modelName].hasOne(db.Utilisateur, {
        foreignKey: {
          name: "utilisateurId",
          allowNull: false,
        },
      }); // an agent belongs to one user
      db[modelName].belongsTo(db.OrganismePret, {
        foreignKey: {
          name: "organismePretId",
          allowNull: false,
        },
      });
      break;
    case "Courtier":
      db[modelName].hasMany(db.DemandePret, {
        foreignKey: {
          name: "courtierId",
          allowNull: true,
        },
      });
      db[modelName].hasOne(db.Utilisateur, {
        foreignKey: {
          name: "utilisateurId",
          allowNull: false,
        },
      });
      db[modelName].hasMany(db.Note, {
        foreignKey: {
          name: "courtierId",
          allowNull: false,
        },
      });
      db[modelName].belongsToMany(db.Client, {
        through: "ClientCourtierDemandePret",
      });
      db[modelName].belongsToMany(db.DemandePret, {
        through: "ClientCourtierDemandePret",
      });
      break;
    case "Note":
      db[modelName].belongsTo(db.Client, {
        foreignKey: {
          name: "clientId",
          allowNull: false,
        },
      });
      db[modelName].belongsTo(db.Courtier, {
        foreignKey: {
          name: "courtierId",
          allowNull: false,
        },
      });
      break;
    case "DossierPret":
      db[modelName].belongsTo(db.DemandePret, {
        foreignKey: {
          name: "demandePretId",
          allowNull: false,
        },
      });
      db[modelName].hasMany(db.Document);
      break;
    case "Document":
      db[modelName].belongsTo(db.TypeDocument);
      db[modelName].belongsTo(db.DossierPret);
      break;
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
