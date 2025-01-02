import express from "express";
import * as chatController from "../Controllers/chatController.js";

const router = express.Router();

// Route pour gérer les messages de chat
router.route("/").post( chatController.handleChatMessage);

export default router;
