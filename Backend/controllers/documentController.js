const { Document } = require("../models");

const createDocument = async (req, res) => {
  try {
    const {
      cheminFichier,
      nomOriginal,
      typeFichier,
      dateTelechargement,
      taille,
      status,
      typeDocumentId,
      dossierPretId,
    } = req.body;

    const newDocument = await Document.create({
      cheminFichier,
      nomOriginal,
      typeFichier,
      dateTelechargement,
      taille,
      status,
      typeDocumentId,
      dossierPretId,
    });

    res.status(201).json(newDocument);
  } catch (error) {
    console.error("Error creating Document:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating Document." });
  }
};

const updateDocument = async (req, res) => {
  const { id } = req.params;
  const {
    cheminFichier,
    nomOriginal,
    typeFichier,
    dateTelechargement,
    taille,
    status,
    typeDocumentId,
    dossierPretId,
  } = req.body;

  try {
    let document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    document = await document.update({
      cheminFichier,
      nomOriginal,
      typeFichier,
      dateTelechargement,
      taille,
      status,
      typeDocumentId,
      dossierPretId,
    });

    res.status(200).json(document);
  } catch (error) {
    console.error("Error updating Document:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating Document." });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error retrieving Documents:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Documents." });
  }
};

const getDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error("Error retrieving Document by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Document." });
  }
};

const deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await Document.findByPk(id);
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }
    await document.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting Document:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting Document." });
  }
};

const getDocumentsByDossierPretId = async (req, res) => {
  const { dossierPretId } = req.params;
  try {
    const documents = await Document.findAll({
      where: { dossierPretId },
    });
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error retrieving Documents by DossierPret ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Documents." });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByDossierPretId,
};
