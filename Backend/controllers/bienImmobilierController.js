const { BienImmobilier } = require("../models");

const createBienImmobilier = async (req, res) => {
  try {
    const { typeBien, adresse, superficie, nbPieces, valeur, photo } = req.body;
    const newBienImmobilier = await BienImmobilier.create({
      typeBien,
      adresse,
      superficie,
      nbPieces,
      valeur,
      photo,
    });
    res.status(201).json(newBienImmobilier);
  } catch (error) {
    console.error("Error creating BienImmobilier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating BienImmobilier." });
  }
};

const getAllBienImmobiliers = async (req, res) => {
  try {
    const bienImmobiliers = await BienImmobilier.findAll();
    res.status(200).json(bienImmobiliers);
  } catch (error) {
    console.error("Error retrieving BienImmobiliers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving BienImmobiliers." });
  }
};

const getBienImmobilierById = async (req, res) => {
  const { id } = req.params;
  try {
    const bienImmobilier = await BienImmobilier.findByPk(id);
    if (!bienImmobilier) {
      return res.status(404).json({ error: "BienImmobilier not found." });
    }
    res.status(200).json(bienImmobilier);
  } catch (error) {
    console.error("Error retrieving BienImmobilier by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving BienImmobilier." });
  }
};

const updateBienImmobilier = async (req, res) => {
  const { id } = req.params;
  const { typeBien, adresse, superficie, nbPieces, valeur, photo } = req.body;
  try {
    let bienImmobilier = await BienImmobilier.findByPk(id);
    if (!bienImmobilier) {
      return res.status(404).json({ error: "BienImmobilier not found." });
    }
    bienImmobilier = await bienImmobilier.update({
      typeBien,
      adresse,
      superficie,
      nbPieces,
      valeur,
      photo,
    });
    res.status(200).json(bienImmobilier);
  } catch (error) {
    console.error("Error updating BienImmobilier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating BienImmobilier." });
  }
};

const deleteBienImmobilier = async (req, res) => {
  const { id } = req.params;
  try {
    const bienImmobilier = await BienImmobilier.findByPk(id);
    if (!bienImmobilier) {
      return res.status(404).json({ error: "BienImmobilier not found." });
    }
    await bienImmobilier.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting BienImmobilier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting BienImmobilier." });
  }
};

module.exports = {
  createBienImmobilier,
  getAllBienImmobiliers,
  getBienImmobilierById,
  updateBienImmobilier,
  deleteBienImmobilier,
};
