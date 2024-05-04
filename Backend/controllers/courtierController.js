const { Courtier } = require("../models");

const createCourtier = async (req, res) => {
  try {
    const { nom, prenom, adresse, entreprise, experience, phone } = req.body;
    const newCourtier = await Courtier.create({
      nom,
      prenom,
      adresse,
      entreprise,
      experience,
      phone,
    });
    res.status(201).json(newCourtier);
  } catch (error) {
    console.error("Error creating Courtier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating Courtier." });
  }
};

const getAllCourtiers = async (req, res) => {
  try {
    const courtiers = await Courtier.findAll();
    res.status(200).json(courtiers);
  } catch (error) {
    console.error("Error retrieving Courtiers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Courtiers." });
  }
};

const getCourtierById = async (req, res) => {
  const { id } = req.params;
  try {
    const courtier = await Courtier.findByPk(id);
    if (!courtier) {
      return res.status(404).json({ error: "Courtier not found." });
    }
    res.status(200).json(courtier);
  } catch (error) {
    console.error("Error retrieving Courtier by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Courtier." });
  }
};

const updateCourtier = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, adresse, entreprise, experience, phone } = req.body;
  try {
    let courtier = await Courtier.findByPk(id);
    if (!courtier) {
      return res.status(404).json({ error: "Courtier not found." });
    }
    courtier = await courtier.update({
      nom,
      prenom,
      adresse,
      entreprise,
      experience,
      phone,
    });
    res.status(200).json(courtier);
  } catch (error) {
    console.error("Error updating Courtier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating Courtier." });
  }
};

const deleteCourtier = async (req, res) => {
  const { id } = req.params;
  try {
    const courtier = await Courtier.findByPk(id);
    if (!courtier) {
      return res.status(404).json({ error: "Courtier not found." });
    }
    await courtier.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting Courtier:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting Courtier." });
  }
};

module.exports = {
  createCourtier,
  getAllCourtiers,
  getCourtierById,
  updateCourtier,
  deleteCourtier,
};
