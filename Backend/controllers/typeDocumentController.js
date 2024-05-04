const { OrganismePret, TypeDocument } = require("../models");

// Create a new TypeDocument
const createTypeDocument = async (req, res) => {
  try {
    const {
      nom,
      description,
      category,
      format,
      maxSize,
      isRequired,
      expirationDate,
      validityPeriod,
    } = req.body;
    const newTypeDocument = await TypeDocument.create({
      nom,
      description,
      category,
      format,
      maxSize,
      isRequired,
      expirationDate,
      validityPeriod,
    });
    res.status(201).json(newTypeDocument);
  } catch (error) {
    console.error("Error creating TypeDocument:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating TypeDocument." });
  }
};

// Update a TypeDocument
const updateTypeDocument = async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    description,
    category,
    format,
    maxSize,
    isRequired,
    expirationDate,
    validityPeriod,
  } = req.body;
  try {
    let typeDocument = await TypeDocument.findByPk(id);
    if (!typeDocument) {
      return res.status(404).json({ error: "TypeDocument not found." });
    }
    typeDocument = await typeDocument.update({
      nom,
      description,
      category,
      format,
      maxSize,
      isRequired,
      expirationDate,
      validityPeriod,
    });
    res.status(200).json(typeDocument);
  } catch (error) {
    console.error("Error updating TypeDocument:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating TypeDocument." });
  }
};
// Retrieve all TypeDocuments
const getAllTypeDocuments = async (req, res) => {
  try {
    const typeDocuments = await TypeDocument.findAll();
    res.status(200).json(typeDocuments);
  } catch (error) {
    console.error("Error retrieving TypeDocuments:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving TypeDocuments." });
  }
};

// Retrieve a single TypeDocument by ID
const getTypeDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const typeDocument = await TypeDocument.findByPk(id);
    if (!typeDocument) {
      return res.status(404).json({ error: "TypeDocument not found." });
    }
    res.status(200).json(typeDocument);
  } catch (error) {
    console.error("Error retrieving TypeDocument by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving TypeDocument." });
  }
};

// Delete a TypeDocument
const deleteTypeDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const typeDocument = await TypeDocument.findByPk(id);
    if (!typeDocument) {
      return res.status(404).json({ error: "TypeDocument not found." });
    }
    await typeDocument.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting TypeDocument:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting TypeDocument." });
  }
};

const getTypeDocumentsByOrganismePretId = async (req, res) => {
  const { organismePretId } = req.params;
  try {
    const organismePret = await OrganismePret.findByPk(organismePretId);
    if (!organismePret) {
      return res.status(404).json({ error: "OrganismePret not found." });
    }
    const typeDocuments = await organismePret.getTypeDocuments();
    res.status(200).json(typeDocuments);
  } catch (error) {
    console.error("Error retrieving TypeDocuments by OrganismePret ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving TypeDocuments." });
  }
};
const addTypeDocumentToOrganismePret = async (req, res) => {
  const { organismePretId, typeDocumentId } = req.body;

  try {
    const organismePret = await OrganismePret.findByPk(organismePretId);
    if (!organismePret) {
      return res.status(404).json({ error: "OrganismePret not found." });
    }

    const typeDocument = await TypeDocument.findByPk(typeDocumentId);
    if (!typeDocument) {
      return res.status(404).json({ error: "TypeDocument not found." });
    }

    await organismePret.addTypeDocument(typeDocument);

    res.status(200).json({ message: "TypeDocument added to OrganismePret." });
  } catch (error) {
    console.error("Error adding TypeDocument to OrganismePret:", error);
    res.status(500).json({
      error: "An error occurred while adding TypeDocument to OrganismePret.",
    });
  }
};

const removeTypeDocumentFromOrganismePret = async (req, res) => {
  const { organismePretId, typeDocumentId } = req.body;

  try {
    const organismePret = await OrganismePret.findByPk(organismePretId);
    if (!organismePret) {
      return res.status(404).json({ error: "OrganismePret not found." });
    }

    const typeDocument = await TypeDocument.findByPk(typeDocumentId);
    if (!typeDocument) {
      return res.status(404).json({ error: "TypeDocument not found." });
    }

    await organismePret.removeTypeDocument(typeDocument);

    res
      .status(200)
      .json({ message: "TypeDocument removed from OrganismePret." });
  } catch (error) {
    console.error("Error removing TypeDocument from OrganismePret:", error);
    res.status(500).json({
      error:
        "An error occurred while removing TypeDocument from OrganismePret.",
    });
  }
};

module.exports = {
  createTypeDocument,
  getAllTypeDocuments,
  getTypeDocumentById,
  updateTypeDocument,
  deleteTypeDocument,
  getTypeDocumentsByOrganismePretId,
  addTypeDocumentToOrganismePret,
  removeTypeDocumentFromOrganismePret,
};
