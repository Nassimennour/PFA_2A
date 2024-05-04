const { DemandePret } = require("../models");

const createDemandePret = async (req, res) => {
  try {
    const {
      montant,
      duree,
      dateSoumission,
      clientId,
      courtierId,
      organismePretId,
      bienImmobilierId,
    } = req.body;

    const newDemandePret = await DemandePret.create({
      montant,
      duree,
      dateSoumission,
      clientId,
      courtierId,
      organismePretId,
      bienImmobilierId,
    });

    res.status(201).json(newDemandePret);
  } catch (error) {
    console.error("Error creating DemandePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating DemandePret." });
  }
};

// Retrieve all DemandePrets
const getAllDemandePrets = async (req, res) => {
  try {
    const demandePrets = await DemandePret.findAll();
    res.status(200).json(demandePrets);
  } catch (error) {
    console.error("Error retrieving DemandePrets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DemandePrets." });
  }
};

const getDemandePretById = async (req, res) => {
  const { id } = req.params;
  try {
    const demandePret = await DemandePret.findByPk(id);
    if (!demandePret) {
      return res.status(404).json({ error: "DemandePret not found." });
    }
    res.status(200).json(demandePret);
  } catch (error) {
    console.error("Error retrieving DemandePret by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DemandePret." });
  }
};

const updateDemandePret = async (req, res) => {
  const { id } = req.params;
  const {
    montant,
    duree,
    dateSoumission,
    judgment,
    comment,
    clientId,
    courtierId,
    organismePretId,
    bienImmobilierId,
  } = req.body;
  try {
    let demandePret = await DemandePret.findByPk(id);
    if (!demandePret) {
      return res.status(404).json({ error: "DemandePret not found." });
    }
    demandePret = await demandePret.update({
      montant,
      duree,
      dateSoumission,
      judgment,
      comment,
      clientId,
      courtierId,
      organismePretId,
      bienImmobilierId,
    });
    res.status(200).json(demandePret);
  } catch (error) {
    console.error("Error updating DemandePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating DemandePret." });
  }
};

const deleteDemandePret = async (req, res) => {
  const { id } = req.params;
  try {
    const demandePret = await DemandePret.findByPk(id);
    if (!demandePret) {
      return res.status(404).json({ error: "DemandePret not found." });
    }
    await demandePret.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting DemandePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting DemandePret." });
  }
};

const getLastDemandePretByClientId = async (req, res) => {
  const { clientId } = req.params;
  try {
    const lastDemandePret = await DemandePret.findOne({
      where: { clientId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(lastDemandePret);
  } catch (error) {
    console.error("Error retrieving last DemandePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving last DemandePret." });
  }
};

const submitJudgment = async (req, res) => {
  const { demandeId } = req.params;
  const { judgment, comment } = req.body;
  try {
    const demandePret = await DemandePret.findByPk(demandeId);
    if (!demandePret) {
      return res.status(404).json({ error: "DemandePret not found." });
    }
    demandePret.judgment = judgment;
    demandePret.comment = comment;
    await demandePret.save();
    res.status(200).json({ message: "Judgment submitted successfully." });
  } catch (error) {
    console.error("Error submitting judgment:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting judgment." });
  }
};

const getAllDemandePretsByClientId = async (req, res) => {
  const { clientId } = req.params;
  try {
    const demandePrets = await DemandePret.findAll({
      where: { clientId: clientId },
    });
    res.status(200).json(demandePrets);
  } catch (error) {
    console.error("Error retrieving DemandePrets by client ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DemandePrets." });
  }
};

const getAllDemandePretsToOrganismePret = async (req, res) => {
  const { organismePretId } = req.params;
  try {
    const demandePrets = await DemandePret.findAll({
      where: { organismePretId },
    });
    res.status(200).json(demandePrets);
  } catch (error) {
    console.error("Error retrieving DemandePrets to OrganismePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DemandePrets." });
  }
};

const getAllDemandePretsByCourtierId = async (req, res) => {
  const { courtierId } = req.params;
  try {
    const demandePrets = await DemandePret.findAll({
      where: { courtierId },
    });
    res.status(200).json(demandePrets);
  } catch (error) {
    console.error("Error retrieving DemandePrets by courtier ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving DemandePrets." });
  }
};

module.exports = {
  createDemandePret,
  getAllDemandePrets,
  getDemandePretById,
  updateDemandePret,
  deleteDemandePret,
  getAllDemandePretsByClientId,
  getAllDemandePretsToOrganismePret,
  getLastDemandePretByClientId,
  getAllDemandePretsByCourtierId,
  submitJudgment,
};
