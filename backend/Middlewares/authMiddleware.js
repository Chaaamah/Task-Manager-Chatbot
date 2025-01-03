import jwt from "jsonwebtoken";
import UserModel from "../Models/User.js";

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Le token est attendu sous forme "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token manquant ou invalide." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    req.user = user; // Attachez l'utilisateur à la requête
    req.userId = decoded.id; // Ajoutez l'ID de l'utilisateur à la requête
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide." });
  }
};