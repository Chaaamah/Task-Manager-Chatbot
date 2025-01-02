import * as TaskService from "../Services/taskService.js";
import axios from "axios";

export const handleChatMessage = async (req, res) => {
  const { message } = req.body;
  console.log("Requête reçue par le chatbot :", req.body);
  try {
    if (message.toLowerCase().includes("ajoute")) {
      // Ajout d'une tâche
      const taskData = {
        title: "Réunion", // Extraire dynamiquement si possible
        dueDate: new Date(),
        status: "Pending",
        priority: "Medium",
        userId: req.user.id, // Récupérer l'utilisateur connecté
      };

      const task = await TaskService.addTask(taskData);
      return res.json({ reply: `Tâche "${task.title}" ajoutée avec succès.` });
    }

    if (message.toLowerCase().includes("change")) {
      // Modification d'une tâche
      const taskId = "id_de_la_tâche"; // Remplacez par une extraction NLP si possible
      const updatedData = { priority: "High" };

      const task = await TaskService.updateTask(taskId, updatedData);
      return res.json({ reply: `La priorité de "${task.title}" a été mise à jour.` });
    }

    if (message.toLowerCase().includes("supprime")) {
      // Suppression d'une tâche
      const taskId = "id_de_la_tâche"; // Remplacez par une extraction NLP si possible

      await TaskService.deleteTask(taskId);
      return res.json({ reply: `La tâche a été supprimée avec succès.` });
    }

    // Interaction standard avec le chatbot
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      { contents: [{ role: "user", parts: [{ text: message }] }] },
      { headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GOOGLE_API_KEY } }
    );

    const botReply = response.data.candidates[0].content.parts[0].text;
    return res.json({ reply: botReply });
  } catch (error) {
    console.error("Erreur API Chatbot :", error);
    res.status(500).json({ error: "Erreur lors du traitement de la demande." });
  }
};
