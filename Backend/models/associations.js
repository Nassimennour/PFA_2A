// associations.js

const associateModels = (models) => {
  const {
    User,
    Client,
    Courtier,
    AgentPret,
    DemandePret,
    DossierPret,
    OrganismePret,
    Note,
    Document,
    TypeDocument,
    BienImmobilier,
    OrganismePretTypeDocument,
  } = models;

  User.hasOne(Client, { foreignKey: "userId" });
  Client.belongsTo(User, { foreignKey: "userId" });

  User.hasOne(Courtier, { foreignKey: "userId" });
  Courtier.belongsTo(User, { foreignKey: "userId" });

  User.hasOne(AgentPret, { foreignKey: "userId" });
  AgentPret.belongsTo(User, { foreignKey: "userId" });

  // User has many DemandesPret (assuming you meant DemandePret)
  Client.hasMany(DemandePret, { foreignKey: "clientId" });

  // DemandePret can have one Courtier or null
  DemandePret.belongsTo(Courtier, {
    foreignKey: "courtierId",
    allowNull: true,
  });

  // AgentPret has one OrganismePret
  AgentPret.belongsTo(OrganismePret, { foreignKey: "organismePretId" });

  // OrganismePret has many AgentsPret
  OrganismePret.hasMany(AgentPret, { foreignKey: "organismePretId" });

  // DemandePret has one DossierPret
  DemandePret.hasOne(DossierPret, { foreignKey: "demandePretId" });

  // DossierPret has many Documents
  DossierPret.hasMany(Document, { foreignKey: "dossierPretId" });

  // Document is related to one TypeDocument
  Document.belongsTo(TypeDocument, { foreignKey: "typeDocumentId" });

  // DemandePret is related to one BienImmobilier
  DemandePret.belongsTo(BienImmobilier, { foreignKey: "bienImmobilierId" });
  // DemandePret belongs to OrganismePret
  DemandePret.belongsTo(OrganismePret, { foreignKey: "organismePretId" });

  // Note is related to one User (Client) and one Courtier
  Note.belongsTo(User, { as: "client", foreignKey: "clientId" });
  Note.belongsTo(Courtier, { foreignKey: "courtierId" });
  TypeDocument.belongsToMany(OrganismePret, {
    through: "OrganismePretTypeDocument",
  });
  OrganismePret.belongsToMany(TypeDocument, {
    through: "OrganismePretTypeDocument",
  });
  // Define other associations...

  return models;
};

module.exports = associateModels;
