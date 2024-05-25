const express = require("express");
const router = express.Router();
const {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByDossierPretId,
} = require("../controllers/documentController");

router.post("/", createDocument);
router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);
router.get("/dossier/:dossierPretId", getDocumentsByDossierPretId);

module.exports = router;
