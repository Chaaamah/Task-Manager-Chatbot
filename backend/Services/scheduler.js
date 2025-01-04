import schedule from 'node-schedule';
import TaskModel from "../Models/Task.js";  // Assurez-vous d'importer le modèle de tâche
import { Server } from 'socket.io';

const io = new Server(httpServer);  // Si vous utilisez socket.io avec un serveur HTTP

// Planification pour vérifier les tâches chaque minute
schedule.scheduleJob('* * * * *', async () => {  // Exécuter toutes les minutes
  try {
    const now = new Date();
    const tasks = await TaskModel.find({
      dueDate: { $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) }, // Échéance dans les 24 heures
      status: { $ne: 'Completed' }
    });

    tasks.forEach(task => {
      console.log(`Rappel : La tâche "${task.title}" est proche de son échéance.`);

      // Envoyer une notification au client via WebSocket
      io.emit('taskReminder', {
        taskId: task._id,
        title: task.title,
        dueDate: task.dueDate
      });
    });
  } catch (error) {
    console.error("Erreur lors de la vérification des rappels :", error);
  }
});
