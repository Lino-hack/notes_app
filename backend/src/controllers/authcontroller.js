const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);
    return res.status(201).json({
      message: "Utilisateur créé",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    // Log détaillé pour le débogage
    if (process.env.NODE_ENV !== "test") {
      // eslint-disable-next-line no-console
      console.error("Register error:", error);
    }
    
    // Gestion spécifique des erreurs MongoDB
    if (error.name === "MongoServerError" || error.name === "MongoNetworkError") {
      return res.status(503).json({ 
        message: "Base de données non disponible. Vérifiez que MongoDB est démarré." 
      });
    }
    
    // Erreur de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(e => e.message).join(", ");
      return res.status(400).json({ message: messages });
    }
    
    return res.status(500).json({ 
      message: error.message || "Erreur lors de la création du compte" 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = generateToken(user._id);
    return res.json({
      message: "Connexion réussie",
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
