import * as userController from '../Controllers/userController.js'

import express from 'express'

const router = express.Router()

router.route("/").get(userController.getAllUsers)
                 .post(userController.addUser)

router.route("/:id").get(userController.getUserById)
                .delete(userController.deleteUser)
                .patch(userController.updateUser)

router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);

router.post("/logout", (req, res) => {
    try {
      // Exemple : Si vous utilisez un stockage côté serveur pour les tokens, invalidez le token ici.
      res.status(200).json({ message: "Déconnexion réussie." });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la déconnexion." });
    }
  });

export default router;

