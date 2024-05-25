const express = require("express");
const router = express.Router();
const {
  createBienImmobilier,
  getAllBienImmobiliers,
  getBienImmobilierById,
  updateBienImmobilier,
  deleteBienImmobilier,
} = require("../controllers/bienImmobilierController");

router.post("/", createBienImmobilier);
router.get("/", getAllBienImmobiliers);
router.get("/:id", getBienImmobilierById);
router.put("/:id", updateBienImmobilier);
router.delete("/:id", deleteBienImmobilier);

module.exports = router;
