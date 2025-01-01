import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Bienvenue dans TaskPilot</h1>
      <div className="space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-500 text-white rounded">Connexion</button>
        </Link>
        <Link to="/register">
          <button className="px-6 py-2 bg-green-500 text-white rounded">Inscription</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
