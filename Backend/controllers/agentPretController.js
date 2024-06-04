const { AgentPret } = require("../models");

const createAgentPret = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      adresse,
      cin,
      telephone,
      numLicence,
      anneesExperience,
      diplome,
      organismePretId,
      userId,
    } = req.body;

    const newAgentPret = await AgentPret.create({
      nom,
      prenom,
      adresse,
      cin,
      telephone,
      numLicence,
      anneesExperience,
      diplome,
      organismePretId,
      userId,
    });

    res.status(201).json(newAgentPret);
  } catch (error) {
    console.error("Error creating AgentPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating AgentPret." });
  }
};

const updateAgentPret = async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    prenom,
    adresse,
    cin,
    telephone,
    numLicence,
    anneesExperience,
    diplome,
    organismePretId,
    userId,
  } = req.body;

  try {
    let agentPret = await AgentPret.findByPk(id);
    if (!agentPret) {
      return res.status(404).json({ error: "AgentPret not found." });
    }

    agentPret = await agentPret.update({
      nom,
      prenom,
      adresse,
      telephone,
      numLicence,
      cin,
      anneesExperience,
      diplome,
      organismePretId,
      userId,
    });

    res.status(200).json(agentPret);
  } catch (error) {
    console.error("Error updating AgentPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating AgentPret." });
  }
};

const getAllAgentPrets = async (req, res) => {
  try {
    const agentPrets = await AgentPret.findAll();
    res.status(200).json(agentPrets);
  } catch (error) {
    console.error("Error retrieving AgentPrets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving AgentPrets." });
  }
};

const getAgentPretById = async (req, res) => {
  const { id } = req.params;
  try {
    const agentPret = await AgentPret.findByPk(id);
    if (!agentPret) {
      return res.status(404).json({ error: "AgentPret not found." });
    }
    res.status(200).json(agentPret);
  } catch (error) {
    console.error("Error retrieving AgentPret by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving AgentPret." });
  }
};

const deleteAgentPret = async (req, res) => {
  const { id } = req.params;
  try {
    const agentPret = await AgentPret.findByPk(id);
    if (!agentPret) {
      return res.status(404).json({ error: "AgentPret not found." });
    }
    await agentPret.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting AgentPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting AgentPret." });
  }
};

const getAgentsByOrganismePretId = async (req, res) => {
  const { organismePretId } = req.params;
  try {
    const agents = await AgentPret.findAll({
      where: { organismePretId },
    });
    res.status(200).json(agents);
  } catch (error) {
    console.error("Error retrieving agents by organismePretId:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving agents." });
  }
};
const getAgentPretByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const agentPret = await AgentPret.findOne({ where: { userId } });
    if (!agentPret) {
      return res.status(404).json({ error: "AgentPret not found." });
    }
    res.status(200).json(agentPret);
  } catch (error) {
    console.error("Error retrieving AgentPret by User ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving AgentPret." });
  }
};

module.exports = {
  createAgentPret,
  getAllAgentPrets,
  getAgentPretById,
  updateAgentPret,
  deleteAgentPret,
  getAgentsByOrganismePretId,
  getAgentPretByUserId,
};
