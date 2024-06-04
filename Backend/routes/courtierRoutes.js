const express = require("express");
const router = express.Router();
const {
  createCourtier,
  getAllCourtiers,
  getCourtierById,
  getCourtierByUserId,
  updateCourtier,
  deleteCourtier,
  getLoanStatsByCourtier,
  countLoansByCourtier,
  averageLoanAmountByCourtier,
} = require("../controllers/courtierController");

const { check, validationResult } = require("express-validator");

const validateCourtier = [
  check("nom").isLength({ min: 1 }).withMessage("Name must be specified."),
  check("prenom")
    .isLength({ min: 1 })
    .withMessage("First name must be specified."),
  check("cin").isLength({ min: 1 }).withMessage("CIN must be specified."),
  check("adresse")
    .isLength({ min: 1 })
    .withMessage("Address must be specified."),
  check("entreprise")
    .isLength({ min: 1 })
    .withMessage("Company must be specified."),
  check("experience")
    .optional()
    .isInt()
    .withMessage("Experience must be an integer."),
  check("phone")
    .matches(/^\d{9,10}$/)
    .withMessage("Phone number must be between 9 and 10 digits."),
];

router.post("/", validateCourtier, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  createCourtier(req, res);
});
// Route to get all courtiers
router.get("/", getAllCourtiers);
// Route to get a courtier by ID
router.get("/:id", getCourtierById);
// Route to update a courtier
router.put("/:id", validateCourtier, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateCourtier(req, res);
});
// Route to delete a courtier
router.delete("/:id", deleteCourtier);
// Route to get count of active loans by courtier
// Route to get count of loans by courtier
router.get("/loans/count", countLoansByCourtier);
// Route to get average loan amount by courtier
router.get("/loans/average", averageLoanAmountByCourtier);
router.get("/user/:userId", getCourtierByUserId);
router.get("/stats/:id", getLoanStatsByCourtier);

module.exports = router;
