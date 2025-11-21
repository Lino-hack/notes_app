const express = require("express");
const { body } = require("express-validator");
const { register, login } = require("../controllers/authcontroller");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Nom trop court"),
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Le mot de passe doit contenir au moins 8 caractères"),
    validateRequest,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
    body("password").notEmpty().withMessage("Mot de passe requis"),
    validateRequest,
  ],
  login
);

module.exports = router;
