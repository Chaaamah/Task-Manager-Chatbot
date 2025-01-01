import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditUser() {
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError("Erreur lors du chargement de l'utilisateur.");
        console.error(err);
      }
    };
    fetchUser();
  }, [userId]);

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
    if (!user.name || !user.email) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, user);
      navigate("/users"); 
    } catch (err) {
      setError("Erreur lors de la modification de l'utilisateur.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Modifier l'utilisateur</h2>
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
            Mot de passe (laisser vide pour ne pas changer)
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Modifier
        </button>
      </form>
    </div>
  );
}

export default EditUser;