const express = require("express");
const router = express.Router();
const {
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
  getDemandePretWithClientByCourtier,
} = require("../controllers/demandePretController");

router.post("/", createDemandePret);
router.get("/", getAllDemandePrets);
router.get("/:id", getDemandePretById);
router.put("/:id", updateDemandePret);
router.delete("/:id", deleteDemandePret);
router.get("/client/:clientId", getAllDemandePretsByClientId);
router.get("/organisme/:organismePretId", getAllDemandePretsToOrganismePret);
router.get("/last/client/:clientId", getLastDemandePretByClientId);
router.get("/courtier/:courtierId", getAllDemandePretsByCourtierId);
router.post("/judgment/:demandeId", submitJudgment);
router.get("/courtier/clients/:courtierId", getDemandePretWithClientByCourtier);

module.exports = router;
