import express from 'express';

import taskRouter from './Routes/taskRoutes.js';
import userRouter from './Routes/userRoutes.js';

import cors from 'cors'
import dotenv from "dotenv"

dotenv.config();

import mongoose  from 'mongoose';

const app = express();

app.use(express.json());

app.use(cors())
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.send("<h1> Welcome to your TaskPilot </h1>")
})

// etablir la connexion avec la base de donnee
mongoose.connect(process.env.DB_URL)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("===============================================");
            console.log("Server is running");
            console.log("===============================================");
        });
    }).catch(err => {
        console.log(err);
    });
