const express = require("express");
const router = express.Router();
const {
  getAllInterestRates,
  getInterestRateById,
  createInterestRate,
  updateInterestRate,
  deleteInterestRate,
  getInterestRateByDuree,
  getInterestRatesByOrganismePretId,
} = require("../controllers/interestRateController");

router.post("/", createInterestRate);
router.get("/", getAllInterestRates);
router.get("/:id", getInterestRateById);
router.put("/:id", updateInterestRate);
router.delete("/:id", deleteInterestRate);
router.get("/duree/:duree", getInterestRateByDuree);
router.get("/organisme/:organismePretId", getInterestRatesByOrganismePretId);

module.exports = router;
