const { Courtier, DemandePret, sequelize } = require("../models");
const { Op } = require("sequelize");

const createCourtier = async (req, res) => {
  try {
    const { nom, prenom, adresse, entreprise, experience, phone, cin, userId } =
      req.body;
    const newCourtier = await Courtier.create({
      nom,
      prenom,
      adresse,
      entreprise,
      experience,
      phone,
      cin,
      userId,
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
  const { nom, prenom, adresse, entreprise, experience, phone, cin, userId } =
    req.body;
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
      cin,
      userId,
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
const countLoansByCourtier = async (courtierId) => {
  return await DemandePret.count({
    where: { courtierId },
    include: [
      { model: Courtier, as: "courtier", attributes: ["nom", "prenom"] },
    ],
  });
};

const averageLoanAmountByCourtier = async (courtierId) => {
  return await DemandePret.findAll({
    where: { courtierId },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("montant")), "averageLoanAmount"],
    ],
    include: [
      { model: Courtier, as: "courtier", attributes: ["nom", "prenom"] },
    ],
  });
};
const getLoanStatsByCourtier = async (req, res) => {
  const { id } = req.params;
  try {
    const loanCounts = await countLoansByCourtier(id);
    const averageLoanAmounts = await averageLoanAmountByCourtier(id);

    const statsByCourtier = {
      courtierId: id,
      loanCount: loanCounts.count || 0,
      averageLoanAmount: averageLoanAmounts.averageLoanAmount || 0,
    };

    res.status(200).json(statsByCourtier);
  } catch (error) {
    console.error("Error retrieving loan stats by Courtier:", error);
    res.status(500).json({
      error: "An error occurred while retrieving loan stats by Courtier.",
    });
  }
};

const getCourtierByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const courtier = await Courtier.findOne({ where: { userId } });
    if (!courtier) {
      return res.status(404).json({ error: "Courtier not found." });
    }
    res.status(200).json(courtier);
  } catch (error) {
    console.error("Error retrieving Courtier by User ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving Courtier." });
  }
};

module.exports = {
  createCourtier,
  getAllCourtiers,
  getCourtierById,
  updateCourtier,
  deleteCourtier,
  getLoanStatsByCourtier,
  countLoansByCourtier,
  averageLoanAmountByCourtier,
  getCourtierByUserId,
};
