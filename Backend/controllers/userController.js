// controllers/userController.js

const { User } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const newUser = await User.create({ username, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role, clientId, courtierId, agentPretId } =
    req.body;
  try {
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.username = username;
    user.email = email;
    user.password = password;
    user.role = role;
    user.clientId = clientId;
    user.courtierId = courtierId;
    user.agentPretId = agentPretId;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user by username:", error);
    res.status(500).json({ error: "An error occurred while retrieving user." });
  }
};

exports.getUserByClientId = async (req, res) => {
  const { clientId } = req.params;
  try {
    const user = await User.findOne({ where: { clientId } });
    if (!user) {
      return res.status(404).json({ error: "User not found for clientId." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving User by clientId:", error);
    res.status(500).json({ error: "An error occurred while retrieving User." });
  }
};

exports.getUserByCourtierId = async (req, res) => {
  const { courtierId } = req.params;
  try {
    const user = await User.findOne({ where: { courtierId } });
    if (!user) {
      return res.status(404).json({ error: "User not found for courtierId." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving User by courtierId:", error);
    res.status(500).json({ error: "An error occurred while retrieving User." });
  }
};

exports.getUserByAgentPretId = async (req, res) => {
  const { agentPretId } = req.params;
  try {
    const user = await User.findOne({ where: { agentPretId } });
    if (!user) {
      return res.status(404).json({ error: "User not found for agentPretId." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving User by agentPretId:", error);
    res.status(500).json({ error: "An error occurred while retrieving User." });
  }
};
