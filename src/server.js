const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.json({ message: "Backend opérationnel 🚀" });
});

// Lancement serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Serveur lancé sur le port " + PORT));
