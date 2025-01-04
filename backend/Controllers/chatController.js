import * as TaskController from '../Controllers/taskController.js';
import axios from 'axios';

const parseTaskMessage = (message) => {
  const lines = message.split('\n');
  const taskDetails = {};

  if (message.includes('nom:')) {
    taskDetails.title = message.match(/nom:\s*(.+?)\s+(description:|dueDate:|priority:|status:|$)/i)?.[1]?.trim();
  }
  if (message.includes('description:')) {
      taskDetails.description = message.match(/description:\s*(.+?)\s+(dueDate:|priority:|status:|$)/i)?.[1]?.trim();
  }
  if (message.includes('dueDate:')) {
      taskDetails.dueDate = new Date(message.match(/dueDate:\s*(\d{4}-\d{2}-\d{2})/i)?.[1]?.trim());
  }
  if (message.includes('priority:')) {
      taskDetails.priority = message.match(/priority:\s*(.+?)\s+(status:|$)/i)?.[1]?.trim();
  }
  if (message.includes('status:')) {
      taskDetails.status = message.match(/status:\s*(.+?)$/i)?.[1]?.trim();
  }

  return taskDetails;
};

export const handleChatMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.userId; // Récupérez l'ID de l'utilisateur à partir de req.userId

  try {
    console.log("Message reçu :", message);
    console.log("User ID :", userId);

    if (!message) {
      return res.status(400).json({ reply: "Le message est requis." });
    }

    // Ajouter une tâche
    if (message.toLowerCase().includes('ajoute')) {
      const taskDetails = parseTaskMessage(message);
      taskDetails.userId = userId; // Utilisez l'ID de l'utilisateur
      console.log("Détails de la tâche :", taskDetails);

      // Appel de la fonction addTask
      const taskResponse = await TaskController.addTask({ body: taskDetails });
      if (taskResponse && taskResponse.title) {
        return res.json({ reply: `Tâche "${taskResponse.title}" ajoutée avec succès.` });
      } else {
        return res.status(500).json({ reply: "Erreur lors de l'ajout de la tâche." });
      }
    }

    // Supprimer une tâche par nom
if (message.toLowerCase().includes('supprime')) {
  const taskNameMatch = message.match(/supprime\s+(.+)/i); // Extraire le nom de la tâche après "supprime"
  if (!taskNameMatch || !taskNameMatch[1]) {
    return res.status(400).json({ reply: "Nom de la tâche manquant." });
  }

  const taskName = taskNameMatch[1].trim(); // Nom de la tâche
  console.log("Nom de la tâche à supprimer :", taskName);

  try {
    // Récupérer la tâche par nom et userId
    const tasksResponse = await TaskController.getTasksByUserId({ params: { userId } });
    if (!tasksResponse || !Array.isArray(tasksResponse)) {
      return res.status(404).json({ reply: "Aucune tâche trouvée pour cet utilisateur." });
    }

    const taskToDelete = tasksResponse.find(task => task.title === taskName);
    if (!taskToDelete) {
      return res.status(404).json({ reply: `Aucune tâche trouvée avec le nom "${taskName}".` });
    }

    // Supprimer la tâche
    await TaskController.deleteTask({ params: { id: taskToDelete._id } });
    return res.json({ reply: `Tâche "${taskName}" supprimée avec succès.` });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    return res.status(500).json({ reply: "Erreur lors de la suppression de la tâche." });
  }
}

// Modifier une tâche par nom
if (message.toLowerCase().includes('modifie')) {
  const taskNameMatch = message.match(/modifie\s+(.+)/i); // Extraire le nom de la tâche après "modifie"
  if (!taskNameMatch || !taskNameMatch[1]) {
    return res.status(400).json({ reply: "Nom de la tâche manquant." });
  }

  const taskName = taskNameMatch[1].trim(); // Nom de la tâche
  console.log("Nom de la tâche à modifier :", taskName);

  try {
    // Récupérer la tâche par nom et userId
    const tasksResponse = await TaskController.getTasksByUserId({ params: { userId } });
    if (!tasksResponse || !Array.isArray(tasksResponse)) {
      return res.status(404).json({ reply: "Aucune tâche trouvée pour cet utilisateur." });
    }

    const taskToUpdate = tasksResponse.find(task => task.title === taskName);
    if (!taskToUpdate) {
      return res.status(404).json({ reply: `Aucune tâche trouvée avec le nom "${taskName}".` });
    }

    // Extraire les nouveaux détails de la tâche
    const taskDetails = parseTaskMessage(message);
    taskDetails.userId = userId; // Utilisez l'ID de l'utilisateur

    // Modifier la tâche
    const updatedTask = await TaskController.updateTask({ params: { id: taskToUpdate._id }, body: taskDetails });
    if (updatedTask && updatedTask.title) {
      return res.json({ reply: `Tâche "${updatedTask.title}" modifiée avec succès.` });
    } else {
      return res.status(500).json({ reply: "Erreur lors de la modification de la tâche." });
    }
  } catch (error) {
    console.error("Erreur lors de la modification de la tâche :", error);
    return res.status(500).json({ reply: "Erreur lors de la modification de la tâche." });
  }
}
    // Interaction standard avec le chatbot
    console.log("Appel à l'API Google Gemini...");
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const botReply = response.data.candidates[0].content.parts[0].text;
    console.log("Réponse du chatbot :", botReply);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Erreur API Chatbot :", error);
    res.status(500).json({ reply: "Tache enregistrer avec succes." });
  }
};