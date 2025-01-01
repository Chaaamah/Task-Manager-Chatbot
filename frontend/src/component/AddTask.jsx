import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

function AddTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    status: "Pending",
    userId: "",
  });

  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]); // Stockage des utilisateurs
  const [loading, setLoading] = useState(true); // État de chargement
  const navigate = useNavigate();

  useEffect(() => {
    // Charger la liste des utilisateurs depuis une API
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des utilisateurs:", err);
        setError("Erreur lors du chargement des utilisateurs. Veuillez réessayer.");
      } finally {
        setLoading(false); // Arrêter le chargement
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  async function handleSubmit(e){
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!task.title || !task.priority || !task.status || !task.userId) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/tasks", task);
      navigate("/dashboard");
    } catch (err) {
      setError("Erreur lors de l'ajout de la tâche. Veuillez réessayer.");
      console.error(err);
    }
  };

  // Afficher un message de chargement pendant le chargement des utilisateurs
  if (loading) {
    return <div className="text-center mt-5">Chargement des utilisateurs...</div>;
  }

  // Afficher un message d'erreur si le chargement des utilisateurs échoue
  if (error && users.length === 0) {
    return <div className="text-center mt-5">{error}</div>;
  }

  return (
    <div className="min-h-full">
      {/* Barre de navigation */}
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="shrink-0"></div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <Link to="/dashboard" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                        Dashboard
                      </Link>
                      <Link to="/add_tasks" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                        Tasks
                      </Link>
                      <Link to="/users" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                        Users
                      </Link>
                      <Link to="/chatbot" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                        Chatbot
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Bouton de notifications */}
                    <button
                      type="button"
                      className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">Voir les notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Menu utilisateur */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Ouvrir le menu utilisateur</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={user.imageUrl}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={`${
                                    active ? "bg-gray-100" : ""
                                  } block px-4 py-2 text-sm text-gray-700`}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Bouton mobile */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Ouvrir le menu principal</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>

      <div className="container mt-5">
        <h2 className="mb-4">Ajouter une nouvelle tâche</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* Champ Titre */}
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Titre <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Champ Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={task.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Champ Date d'échéance */}
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">Date d'échéance</label>
            <input
              type="date"
              className="form-control"
              id="dueDate"
              name="dueDate"
              value={task.dueDate}
              onChange={handleChange}
            />
          </div>

          {/* Champ Priorité */}
          <div className="mb-3">
            <label htmlFor="priority" className="form-label">
              Priorité <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Faible</option>
              <option value="Medium">Moyenne</option>
              <option value="High">Haute</option>
            </select>
          </div>

          {/* Champ Statut */}
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Statut <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">En attente</option>
              <option value="In Progress">En cours</option>
              <option value="Completed">Terminé</option>
            </select>
          </div>

          {/* Champ Affectation */}
          <div className="mb-3">
            <label htmlFor="userId" className="form-label">
              Affecté à <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="userId"
              name="userId"
              value={task.userId}
              onChange={handleChange}
              required
            >
              <option value="">-- Sélectionnez un utilisateur --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
      </div>
    </div>
  );
}

export default AddTask;