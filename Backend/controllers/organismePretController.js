const { OrganismePret, DemandePret, sequelize } = require("../models");
const { Op } = require("sequelize");

const createOrganismePret = async (req, res) => {
  try {
    const organismePret = await OrganismePret.create(req.body);
    res.status(201).json(organismePret);
  } catch (error) {
    console.error("Error creating organismePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the organismePret." });
  }
};

const getAllOrganismesPret = async (req, res) => {
  try {
    const organismesPret = await OrganismePret.findAll();
    res.status(200).json(organismesPret);
  } catch (error) {
    console.error("Error retrieving organismesPret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving organismesPret." });
  }
};

const getOrganismePretById = async (req, res) => {
  const { id } = req.params;
  try {
    const organismePret = await OrganismePret.findByPk(id);
    if (organismePret) {
      res.status(200).json(organismePret);
    } else {
      res.status(404).json({ message: "OrganismePret not found." });
    }
  } catch (error) {
    console.error("Error retrieving organismePret by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the organismePret." });
  }
};

const updateOrganismePret = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await OrganismePret.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedOrganismePret = await OrganismePret.findByPk(id);
      res.status(200).json(updatedOrganismePret);
    } else {
      res.status(404).json({ message: "OrganismePret not found." });
    }
  } catch (error) {
    console.error("Error updating organismePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the organismePret." });
  }
};

const deleteOrganismePret = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await OrganismePret.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "OrganismePret not found." });
    }
  } catch (error) {
    console.error("Error deleting organismePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the organismePret." });
  }
};

// Method to search organismesPret by name
const searchOrganismesPretByName = async (nom) => {
  try {
    const organismesPret = await OrganismePret.findAll({
      where: {
        nom: {
          [sequelize.Op.iLike]: `%${nom}%`, // Case-insensitive search for nom
        },
      },
    });

    return organismesPret;
  } catch (error) {
    console.error("Error searching organismesPret by name:", error);
    throw error;
  }
};

// qlq methodes d'analyse :
const countLoansByOrganismePret = async () => {
  return await DemandePret.count({
    group: ["organismePretId"],
    include: [
      { model: OrganismePret, as: "organismePret", attributes: ["nom"] },
    ],
  });
};

const averageLoanAmountByOrganismePret = async () => {
  return await DemandePret.findAll({
    group: ["organismePretId"],
    attributes: [
      [sequelize.fn("AVG", sequelize.col("montant")), "averageLoanAmount"],
    ],
    include: [
      { model: OrganismePret, as: "organismePret", attributes: ["nom"] },
    ],
  });
};

const countActiveLoansByOrganismePret = async () => {
  return await DemandePret.count({
    where: { judgment: "accepted" },
    group: ["organismePretId"],
    include: [
      { model: OrganismePret, as: "organismePret", attributes: ["nom"] },
    ],
  });
};
const countOrganismesPret = async (req, res) => {
  try {
    const count = await OrganismePret.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting OrganismePret:", error);
    res
      .status(500)
      .json({ error: "An error occurred while counting OrganismePret." });
  }
};

module.exports = {
  createOrganismePret,
  getAllOrganismesPret,
  getOrganismePretById,
  updateOrganismePret,
  deleteOrganismePret,
  searchOrganismesPretByName,
  countActiveLoansByOrganismePret,
  countLoansByOrganismePret,
  averageLoanAmountByOrganismePret,
  countOrganismesPret,
};
