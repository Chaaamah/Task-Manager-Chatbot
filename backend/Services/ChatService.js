import axios from "axios";

export const processChatMessage = async (message) => {
  try {
    // Appel à l'API Google AI pour traiter le message
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GOOGLE_API_KEY,
        },
      }
    );

    // Récupérer la réponse du bot
    const botReply = response.data.candidates[0].content.parts[0].text;
    return botReply;
  } catch (error) {
    console.error("Erreur dans le service de chatbot :", error);
    throw new Error("Erreur lors du traitement du message.");
  }
};
