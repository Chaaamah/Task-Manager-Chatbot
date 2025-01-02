import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "AddTask", href: "/add_tasks", current: false },
  { name: "Users", href: "/users", current: false },
  { name: "Chatbot", href: "/chatbot", current: false },
];

const userNavigation = [
  { name: "Votre profil", href: "/profile", onclick:"" },
  { name: "Déconnexion", href: "/home", onclick:"{handleLogout}" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function AddTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    status: "Pending",
  });
  

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Récupération de l'utilisateur connecté
  const userId = localStorage.getItem("userId"); // Récupère l'ID utilisateur stocké après connexion
// Récupération des informations de l'utilisateur connecté
  const Storeuser = JSON.parse(localStorage.getItem("user"));
  const user = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
  };

  // Si aucun utilisateur connecté, afficher une erreur
  if (!userId) {
    return (
      <div className="text-center mt-5">
        Erreur : Aucun utilisateur connecté. Veuillez vous connecter.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!task.title || !task.priority || !task.status) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      // Ajouter l'utilisateur connecté au corps de la requête
      const newTask = { ...task, userId };

      await axios.post("http://localhost:5000/api/tasks", newTask);
      navigate("/dashboard");
    } catch (err) {
      setError("Erreur lors de l'ajout de la tâche. Veuillez réessayer.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-full">
      <>
        {/* Barre de navigation */}
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              {/* Barre de navigation principale */}
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    {/* Navigation visible pour les écrans moyens et grands */}
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Bouton de notifications */}
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
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
                              src="https://via.placeholder.com/150"
                              alt="Utilisateur"
                            />
                          </Menu.Button>
                        </div>
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  to={item.href}
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Bouton pour ouvrir le menu mobile */}
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

              {/* Menu mobile */}
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {/* Navigation pour écran réduit */}
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                {/* Menu utilisateur pour écran réduit */}
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src="https://via.placeholder.com/150"
                        alt="Utilisateur"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.name || "Utilisateur"}</div>
                      <div className="text-sm font-medium text-gray-400">{user?.email || "email@example.com"}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>


        {/* Formulaire d'ajout de tâche */}
        <main>
          <div className="container mt-5">
            <h2 className="mb-4">Ajouter une nouvelle tâche</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
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
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  value={task.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="dueDate" className="form-label">
                  Date d'échéance
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dueDate"
                  name="dueDate"
                  value={task.dueDate}
                  onChange={handleChange}
                />
              </div>
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
              <button type="submit" className="btn btn-primary">
                Ajouter
              </button>
            </form>
          </div>
        </main>
      </>
    </div>
  );
}

export default AddTask;
