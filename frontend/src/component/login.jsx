import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
  
      console.log("Tentative de connexion avec :", { email, password });
  
      try {
        const response = await axios.post("https://task-manager-chatbot.onrender.com/api/users/login", {
          email,
          password,
        });
  
        console.log("Réponse de l'API :", response.data);
  
        // Vérifiez si le token ou les informations utilisateur sont renvoyés
        if (!response.data.token || !response.data.user) {
          throw new Error("Réponse invalide du serveur");
        }
  
        // Stocker l'utilisateur et le token dans le localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id); 
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userEmail", response.data.user.email);
  
        // Rediriger vers le tableau de bord
        navigate("/dashboard");
      } catch (err) {
        console.error("Erreur lors de la connexion :", err);
        setError("Connexion échouée. Vérifiez vos identifiants.");
      }
    };
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Connectez-vous</h1>
        <form
          onSubmit={handleLogin}
          className="p-6 rounded shadow-md w-80"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Connexion
          </button>
        </form>
      </div>
    );
  }
  
  export default Login;
  
  