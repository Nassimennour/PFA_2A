const { DossierPret } = require("../models");

const createDossierPret = async (req, res) => {
  try {
    const dossierPret = await DossierPret.create(req.body);
    res.status(201).json(dossierPret);
  } catch (error) {
    console.error("Error creating DossierPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating DossierPret." });
  }
};

const getAllDossierPrets = async (req, res) => {
  try {
    const dossierPrets = await DossierPret.findAll();
    res.status(200).json(dossierPrets);
  } catch (error) {
    console.error("Error retrieving DossierPrets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DossierPrets." });
  }
};

const getDossierPretById = async (req, res) => {
  const { id } = req.params;
  try {
    const dossierPret = await DossierPret.findByPk(id);
    if (!dossierPret) {
      return res.status(404).json({ error: "DossierPret not found." });
    }
    res.status(200).json(dossierPret);
  } catch (error) {
    console.error("Error retrieving DossierPret by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DossierPret." });
  }
};

const updateDossierPret = async (req, res) => {
  const { id } = req.params;
  try {
    let dossierPret = await DossierPret.findByPk(id);
    if (!dossierPret) {
      return res.status(404).json({ error: "DossierPret not found." });
    }
    dossierPret = await dossierPret.update(req.body);
    res.status(200).json(dossierPret);
  } catch (error) {
    console.error("Error updating DossierPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating DossierPret." });
  }
};

const deleteDossierPret = async (req, res) => {
  const { id } = req.params;
  try {
    const dossierPret = await DossierPret.findByPk(id);
    if (!dossierPret) {
      return res.status(404).json({ error: "DossierPret not found." });
    }
    await dossierPret.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting DossierPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting DossierPret." });
  }
};

// Utility methods for analysis

const calculateDebtToIncomeRatio = (totalLiabilities, salary) => {
  if (salary === 0) {
    return null;
  }
  return (totalLiabilities / salary) * 100;
};

const analyzeDossierPret = (dossierPret) => {
  const { salary, totalLiabilities } = dossierPret;
  const debtToIncomeRatio = calculateDebtToIncomeRatio(
    totalLiabilities,
    salary
  );
  return {
    ...dossierPret.toJSON(),
    debtToIncomeRatio,
  };
};

const analyzeAllDossierPrets = async (req, res) => {
  try {
    const dossierPrets = await DossierPret.findAll();
    const analyzedDossierPrets = dossierPrets.map(analyzeDossierPret);
    res.status(200).json(analyzedDossierPrets);
  } catch (error) {
    console.error("Error analyzing DossierPrets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while analyzing DossierPrets." });
  }
};

module.exports = {
  createDossierPret,
  getAllDossierPrets,
  getDossierPretById,
  updateDossierPret,
  deleteDossierPret,
  analyzeAllDossierPrets,
};
