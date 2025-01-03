import schedule from "node-schedule";
import TaskModel from "../Models/Task.js"; // Chemin vers votre modèle Task

// Planification pour vérifier les tâches proches de l'échéance toutes les heures
schedule.scheduleJob("0 * * * *", async () => {
  try {
    const now = new Date();
    const tasks = await TaskModel.find({
      dueDate: { $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) }, // Échéance dans les 24 heures
      status: { $ne: "Completed" },
    });

    tasks.forEach((task) => {
      console.log(`Rappel : La tâche "${task.title}" est proche de son échéance.`);
      // Ici, vous pouvez intégrer un système de notification (email, SMS, etc.)
    });
  } catch (error) {
    console.error("Erreur lors de la vérification des rappels :", error);
  }
});

