import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const user = {
    name: "Nelle Kelly",
    email: "nelle.kelly@example.com",
    imageUrl: "https://via.placeholder.com/150",
  };
  
  const userNavigation = [
    { name: "Votre profil", href: "#" },
    { name: "Déconnexion", href: "#" },
  ];

function AddUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!user.name || !user.email || !user.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users", user);
      navigate("/users"); // Rediriger vers la liste des utilisateurs
    } catch (err) {
      setError("Erreur lors de l'ajout de l'utilisateur.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Ajouter un utilisateur</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nom <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mot de passe <span className="text-danger">*</span>
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Ajouter
        </button>
      </form>
    </div>
  );
}

export default AddUser;