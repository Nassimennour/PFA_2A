const express = require("express");
const router = express.Router();
const {
  createDossierPret,
  getAllDossierPrets,
  getDossierPretById,
  updateDossierPret,
  deleteDossierPret,
  analyzeAllDossierPrets,
  getDossierPretByDemandePretId,
} = require("../controllers/dossierPretController");

router.post("/", createDossierPret);
router.get("/", getAllDossierPrets);
router.get("/:id", getDossierPretById);
router.put("/:id", updateDossierPret);
router.delete("/:id", deleteDossierPret);
router.get("/analyze", analyzeAllDossierPrets);
router.get("/demandePret/:demandePretId", getDossierPretByDemandePretId);

module.exports = router;
