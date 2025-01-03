import * as TaskController from '../Controllers/taskController.js';
import axios from 'axios';

const parseTaskMessage = (message) => {
  const lines = message.split('\n');
  const taskDetails = {};

  lines.forEach((line) => {
    if (line.includes('Nom :')) {
      taskDetails.title = line.split('Nom :')[1].trim();
    } else if (line.includes('Description :')) {
      taskDetails.description = line.split('Description :')[1].trim();
    } else if (line.includes('Date d\'échéance :')) {
      taskDetails.dueDate = new Date(line.split('Date d\'échéance :')[1].trim());
    } else if (line.includes('Priorité :')) {
      taskDetails.priority = line.split('Priorité :')[1].trim().toLowerCase();
    } else if (line.includes('Statut :')) {
      taskDetails.status = line.split('Statut :')[1].trim();
    }
  });

  return taskDetails;
};

export const handleChatMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.userId; // Récupérez l'ID de l'utilisateur à partir de req.userId

  try {
    console.log("Message reçu :", message);
    console.log("User ID :", userId);

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

    if (message.toLowerCase().includes('montre-moi')) {
      const tasksResponse = await TaskController.getTasksByUserId({ params: { userId } });
      if (tasksResponse && Array.isArray(tasksResponse)) {
        const taskList = tasksResponse.map(task => `- ${task.title} (Priorité : ${task.priority}, Échéance : ${task.dueDate}, Statut : ${task.status})`).join('\n');
        return res.json({ reply: `Voici vos tâches :\n${taskList}` });
      } else {
        return res.json({ reply: 'Aucune tâche trouvée.' });
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
    res.status(500).json({ reply: "Désolé, une erreur s’est produite. Veuillez réessayer." });
  }
};