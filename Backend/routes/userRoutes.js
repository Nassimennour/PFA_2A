const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { check, validationResult } = require("express-validator");

const validateUser = [
  check("username")
    .isLength({ min: 1 })
    .withMessage("Username must be specified."),
  check("email").isEmail().withMessage("Email must be valid."),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character."),
  check("role")
    .isIn(["admin", "client", "courtier", "agentPret"])
    .withMessage(
      'Role must be one of "admin", "client", "courtier", "agentPret".'
    ),
];

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  userController.createUser(req, res);
});

router.put("/:id", validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  userController.updateUser(req, res);
});
router.delete("/:id", userController.deleteUser);
router.get("/username/:username", userController.getUserByUsername);
router.get("/clientId/:clientId", userController.getUserByClientId);
router.get("/courtierId/:courtierId", userController.getUserByCourtierId);
router.get("/agentPretId/:agentPretId", userController.getUserByAgentPretId);

module.exports = router;
