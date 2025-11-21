const express = require("express");
const { body, param, query } = require("express-validator");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
  getNoteStats,
} = require("../controllers/noteController");

const categories = ["travail", "personnel", "urgent"];

const noteCreateValidation = [
  body("title").trim().notEmpty().withMessage("Le titre est requis"),
  body("category")
    .isIn(categories)
    .withMessage("Catégorie invalide"),
  body("content").optional().isString(),
  validateRequest,
];

const noteUpdateValidation = [
  param("id").isMongoId().withMessage("Identifiant invalide"),
  body("title").optional().trim().notEmpty(),
  body("category").optional().isIn(categories),
  body("content").optional().isString(),
  validateRequest,
];

const noteIdValidation = [
  param("id").isMongoId().withMessage("Identifiant invalide"),
  validateRequest,
];

const noteQueryValidation = [
  query("search").optional().isString(),
  query("category").optional().isIn(["all", ...categories]),
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  query("sort").optional().isIn(["latest", "oldest", "category"]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
  validateRequest,
];

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  noteCreateValidation,
  createNote
);

router.get("/", authMiddleware, noteQueryValidation, getNotes);

router.get("/stats/overview", authMiddleware, getNoteStats);

router.get("/:id", authMiddleware, noteIdValidation, getNote);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  noteUpdateValidation,
  updateNote
);

router.delete("/:id", authMiddleware, noteIdValidation, deleteNote);

module.exports = router;
