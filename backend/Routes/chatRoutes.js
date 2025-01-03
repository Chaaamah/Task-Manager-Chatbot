import express from 'express';
import { handleChatMessage } from '../Controllers/chatController.js';
import { authenticateUser } from '../Middlewares/authMiddleware.js';

const router = express.Router();

// Protéger la route du chatbot avec le middleware d'authentification
router.post('/', authenticateUser, handleChatMessage);

export default router;