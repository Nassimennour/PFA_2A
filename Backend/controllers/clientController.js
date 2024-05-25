const { Client } = require("../models");

const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the client." });
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error retrieving clients:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving clients." });
  }
};

const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found." });
    }
  } catch (error) {
    console.error("Error retrieving client by ID:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the client." });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  try {
    const [updated] = await Client.update(req.body, {
      where: { id },
    });
    if (updated) {
      const updatedClient = await Client.findByPk(id);
      res.status(200).json(updatedClient);
    } else {
      res.status(404).json({ message: "Client not found." });
    }
  } catch (error) {
    console.error("Error updating client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the client." });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Client.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Client not found." });
    }
  } catch (error) {
    console.error("Error deleting client:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the client." });
  }
};

const clientAnalysis = async () => {
  try {
    // Total number of clients
    const totalClients = await Client.count();
    // Total number of clients grouped by age range
    const clientsByAgeRange = await Client.findAll({
      attributes: [
        [
          sequelize.literal(
            "CASE WHEN DATE_PART('year', AGE(NOW(), \"dateNaissance\")) BETWEEN 18 AND 30 THEN '18-30' WHEN DATE_PART('year', AGE(NOW(), \"dateNaissance\")) BETWEEN 31 AND 40 THEN '31-40' WHEN DATE_PART('year', AGE(NOW(), \"dateNaissance\")) BETWEEN 41 AND 50 THEN '41-50' ELSE '51+' END"
          ),
          "ageRange",
        ],
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: [
        sequelize.literal(
          "CASE WHEN DATE_PART('year', AGE(NOW(), \"dateNaissance\")) BETWEEN 18 AND 30 THEN '18-30' WHEN DATE_PART('year', AGE(NOW(), \"dateNaissance\")) BETWEEN 31 AND 40 THEN '31-40' WHEN DATE_PART('year', AGE(NOW(), \"dateNaissance\")) BETWEEN 41 AND 50 THEN '41-50' ELSE '51+' END"
        ),
      ],
    });

    // Total number of clients per gender
    const clientsByGender = await Client.findAll({
      attributes: [
        "genre",
        [sequelize.fn("count", sequelize.col("id")), "count"],
      ],
      group: ["genre"],
    });

    return {
      totalClients,
      clientsByAgeRange,
      clientsByGender,
    };
  } catch (error) {
    console.error("Error performing client analysis:", error);
    throw error;
  }
};
// Method to search clients by name
const searchClientsByName = async (nom, prenom) => {
  try {
    // Search clients by nom and prenom
    const clients = await Client.findAll({
      where: {
        nom: {
          [sequelize.Op.iLike]: `%${nom}%`, // Case-insensitive search for nom
        },
        prenom: {
          [sequelize.Op.iLike]: `%${prenom}%`, // Case-insensitive search for prenom
        },
      },
    });

    return clients;
  } catch (error) {
    console.error("Error searching clients by name:", error);
    throw error;
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  clientAnalysis,
  searchClientsByName,
};
