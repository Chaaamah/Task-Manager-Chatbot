import React, { useState } from "react";
import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    axios.post("http://localhost:5000/api/chatbot", { message: input })
      .then((response) => {
        setMessages([...messages, { role: "user", content: input }, { role: "bot", content: response.data.reply }]);
        setInput("");
      })
      .catch((error) => console.error("Erreur chatbot :", error));
  };

  return (
    <div className="flex flex-col p-6 bg-gray-100 h-screen">
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"} p-2 rounded`}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-green-500 text-white rounded">Envoyer</button>
      </div>
    </div>
  );
}

export default Chatbot;
