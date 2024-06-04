const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/organismePretController");

router.post("/", createOrganismePret);
router.get("/", getAllOrganismesPret);
router.get("/:id", getOrganismePretById);
router.put("/:id", updateOrganismePret);
router.delete("/:id", deleteOrganismePret);
router.get("/search/:nom", searchOrganismesPretByName);
router.get("/count/activeLoans", countActiveLoansByOrganismePret);
router.get("/count/loans", countLoansByOrganismePret);
router.get("/average/loanAmount", averageLoanAmountByOrganismePret);
router.get("/count", countOrganismesPret);

module.exports = router;
