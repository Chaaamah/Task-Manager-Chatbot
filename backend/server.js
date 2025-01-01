import express from 'express';
import taskRouter from './Routes/taskRoutes.js';
import userRouter from './Routes/userRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';

dotenv.config(); 

const app = express();

app.use(express.json());
app.use(cors());

// Routes existantes
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);

// Nouvelle route pour le chatbot avec Google AI
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', // URL de l'API Google AI
            {
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: message }],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GOOGLE_API_KEY,
                },
            }
        );

        // Renvoyer la réponse du chatbot
        const botReply = response.data.candidates[0].content.parts[0].text;
        res.json({ reply: botReply });
    } catch (error) {
        console.error('Error calling Google AI API:', error);
        res.status(500).json({ 
            error: 'Error processing your request', 
            details: error.response?.data || error.message 
        });
    }
});

// Route d'accueil
app.get('/', (req, res) => {
    res.send('<h1> Welcome to your TaskPilot </h1>');
});

// Connexion à la base de données
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('===============================================');
            console.log('Server is running');
            console.log('===============================================');
        });
    })
    .catch((err) => {
        console.log(err);
    });