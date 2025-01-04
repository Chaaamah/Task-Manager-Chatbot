import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import taskRouter from './Routes/taskRoutes.js';
import userRouter from './Routes/userRoutes.js';
import chatRouter from "./Routes/chatRoutes.js";
import { authenticateUser } from "./Middlewares/authMiddleware.js";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Créer un serveur HTTP à partir d'Express
const httpServer = http.createServer(app);

// Créer un serveur Socket.IO lié à ce serveur HTTP
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Adresse du frontend
        methods: ["GET", "POST"],
    },
});

// Gestion des événements Socket.IO
io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté :", socket.id);

    // Exemple d'envoi de notification
    socket.on("sendNotification", (data) => {
        console.log("Notification reçue :", data);
        socket.emit("taskReminder", { message: "Rappel de tâche !" });
    });

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté :", socket.id);
    });
});

// Middleware et routes
app.use(express.json());
app.use(cors());
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/chat", authenticateUser);

// Route d'accueil
app.get('/', (req, res) => {
    res.send('<h1> Welcome to your TaskPilot </h1>');
});

// Connexion à la base de données
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        // Démarrer le serveur HTTP (et Socket.IO) sur le port défini
        httpServer.listen(process.env.PORT, () => {
            console.log('===============================================');
            console.log('Server is running');
            console.log('===============================================');
            console.log(`Serveur WebSocket sur le port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

export { io };  // Assurez-vous que cette ligne est présente
