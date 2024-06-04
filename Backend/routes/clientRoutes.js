const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  clientAnalysis,
  searchClientsByName,
  getClientByUserId,
} = require("../controllers/clientController");

const validateClient = [
  // Validate fields.
  check("nom").isLength({ min: 1 }).withMessage("Name must be specified."),
  check("prenom")
    .isLength({ min: 1 })
    .withMessage("First name must be specified."),
  check("cin").isLength({ min: 1 }).withMessage("CIN must be specified."),
  check("telephone")
    .matches(/^\d{9,10}$/)
    .withMessage("Phone number must be between 9 and 10 digits."),
  check("adresse")
    .isLength({ min: 1 })
    .withMessage("Address must be specified."),
  check("dateNaissance")
    .isDate()
    .withMessage("Birth date must be a valid date."),
];

router.post("/", validateClient, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  createClient(req, res);
});
// Route to get all clients
router.get("/", getAllClients);
// Route to get a client by ID
router.get("/:id", getClientById);
//Route to get a client by UserId
router.get("/userId/:userId", getClientByUserId);
// Route to update a client
router.put("/:id", validateClient, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateClient(req, res);
});
// Route to delete a client
router.delete("/:id", deleteClient);
// Route to get client analysis
router.get("/analysis", clientAnalysis);
// Route to search clients by name
router.get("/search/:nom/:prenom", searchClientsByName);

module.exports = router;
