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
    InterestRate,
  } = models;

  User.hasOne(Client, { foreignKey: "userId" });
  Client.belongsTo(User, { foreignKey: "userId" });

  User.hasOne(Courtier, { foreignKey: "userId" });
  Courtier.belongsTo(User, { foreignKey: "userId" });

  User.hasOne(AgentPret, { foreignKey: "userId" });
  AgentPret.belongsTo(User, { foreignKey: "userId" });

  // User has many DemandesPret (assuming you meant DemandePret)
  Client.hasMany(DemandePret, { foreignKey: "clientId" });
  DemandePret.belongsTo(Client, { foreignKey: "clientId" });

  // DemandePret can have one Courtier or null
  DemandePret.belongsTo(Courtier, {
    foreignKey: "courtierId",
    allowNull: true,
  });
  Courtier.hasMany(DemandePret, { foreignKey: "courtierId" });

  // AgentPret has one OrganismePret
  AgentPret.belongsTo(OrganismePret, { foreignKey: "organismePretId" });

  // OrganismePret has many AgentsPret
  OrganismePret.hasMany(AgentPret, { foreignKey: "organismePretId" });

  // DemandePret has one DossierPret
  DemandePret.hasOne(DossierPret, { foreignKey: "demandePretId" });
  DossierPret.belongsTo(DemandePret, { foreignKey: "demandePretId" });

  // DossierPret has many Documents
  DossierPret.hasMany(Document, { foreignKey: "dossierPretId" });
  Document.belongsTo(DossierPret, { foreignKey: "dossierPretId" });

  // Document is related to one TypeDocument
  Document.belongsTo(TypeDocument, { foreignKey: "typeDocumentId" });
  TypeDocument.hasMany(Document, { foreignKey: "typeDocumentId" });

  DemandePret.belongsTo(BienImmobilier, { foreignKey: "bienImmobilierId" });
  BienImmobilier.hasMany(DemandePret, { foreignKey: "bienImmobilierId" });
  DemandePret.belongsTo(OrganismePret, { foreignKey: "organismePretId" });
  OrganismePret.hasMany(DemandePret, { foreignKey: "organismePretId" });

  Note.belongsTo(User, { as: "client", foreignKey: "clientId" });
  Note.belongsTo(Courtier, { foreignKey: "courtierId" });
  TypeDocument.belongsToMany(OrganismePret, {
    through: "OrganismePretTypeDocument",
  });
  OrganismePret.belongsToMany(TypeDocument, {
    through: "OrganismePretTypeDocument",
  });
  InterestRate.belongsTo(OrganismePret, { foreignKey: "organismePretId" });
  OrganismePret.hasMany(InterestRate, { foreignKey: "organismePretId" });

  return models;
};

module.exports = associateModels;
