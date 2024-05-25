const express = require("express");
const router = express.Router();
const {
  createTypeDocument,
  getAllTypeDocuments,
  getTypeDocumentById,
  updateTypeDocument,
  deleteTypeDocument,
  getTypeDocumentsByOrganismePretId,
  addTypeDocumentToOrganismePret,
  removeTypeDocumentFromOrganismePret,
} = require("../controllers/typeDocumentController");

router.post("/", createTypeDocument);
router.get("/", getAllTypeDocuments);
router.get("/:id", getTypeDocumentById);
router.put("/:id", updateTypeDocument);
router.delete("/:id", deleteTypeDocument);
router.get("/organisme/:organismePretId", getTypeDocumentsByOrganismePretId);
router.post("/organisme/add", addTypeDocumentToOrganismePret);
router.post("/organisme/remove", removeTypeDocumentFromOrganismePret);

module.exports = router;
