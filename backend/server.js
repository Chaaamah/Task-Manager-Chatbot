import express from 'express';
import "./Services/scheduler.js"
import taskRouter from './Routes/taskRoutes.js';
import userRouter from './Routes/userRoutes.js';
import chatRouter from "./Routes/chatRoutes.js";
import { authenticateUser } from "./Middlewares/authMiddleware.js";
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
app.use("/api/chat", chatRouter);
//app.use("/api/chat", authenticateUser);


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