import React from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from  "./component/home";
import Login from  "./component/login";
import Register from "./component/register"
import Dashboard from "./component/dashboard"
import AddTask from "./component/AddTask"
import Chatbot from "./component/chatbot"
import ProtectedRoute from "./component/ProtectedRoute"

import Profil from "./component/Profil";
  

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/add_tasks" element={<AddTask />} />
        <Route path="/chatbot" element={<Chatbot />} />

        <Route path="/profile" element={<Profil />} />

        
      </Routes>
    </Router>
    </div>
    
  );
}

export default App;
