import { io } from '../server.js';  // Assurez-vous du chemin correct
import schedule from 'node-schedule';
import TaskModel from '../Models/Task.js';

const scheduleTaskReminders = () => {
    schedule.scheduleJob('0 * * * *', async () => { // Exécuter toutes les minutes
        try {
            const now = new Date();
            const tasks = await TaskModel.find({
                dueDate: { $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) }, // Échéance dans 24 heures
                status: { $ne: 'Completed' }
            });

            tasks.forEach((task) => {
                console.log(`Rappel : La tâche "${task.title}" est proche de son échéance.`);
                
                // Envoyer une notification au client via WebSocket
                io.emit('taskReminder', {
                    taskId: task._id,
                    title: task.title,
                    dueDate: task.dueDate,
                });
            });
        } catch (error) {
            console.error('Erreur lors de la vérification des rappels :', error);
        }
    });
};

export default scheduleTaskReminders;
