const fs = require("fs");
const { validationResult } = require("express-validator");

const cleanupUploadedFile = (file) => {
  if (file?.path) {
    fs.promises.unlink(file.path).catch(() => null);
  }
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    cleanupUploadedFile(req.file);
    return res.status(422).json({
      message: "Requête invalide",
      errors: errors.array(),
    });
  }
  return next();
};

module.exports = validateRequest;

