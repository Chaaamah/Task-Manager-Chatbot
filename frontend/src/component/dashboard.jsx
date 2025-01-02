import React, { useEffect, useState } from "react";
import axios from "axios";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: true },
    { name: "AddTask", href: "/add_tasks", current: false },
    { name: "Users", href: "/users", current: false },
    { name: "Chatbot", href: "/chatbot", current: false },
  ];

  const userNavigation = [
    { name: "Votre profil", href: "/profile" },
    { name: "Déconnexion", href: "/logout" },
  ];

  // Fonction utilitaire pour générer des classes conditionnelles
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    // Récupération des informations utilisateur depuis le localStorage
    const storedUser = {
      id: localStorage.getItem("userId"),
      name: localStorage.getItem("userName"),
      email: localStorage.getItem("userEmail"),
    };

    if (!storedUser.id) {
      setError("Aucun utilisateur connecté.");
      return;
    }

    setUser(storedUser);

    // Récupération des tâches associées à l'utilisateur connecté
    axios
      .get(`http://localhost:5000/api/tasks/user/${storedUser.id}`)
      .then((response) => setTasks(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des tâches :", error);
        setError("Impossible de charger les tâches.");
      });
  }, []);

  return (
    <>
      <div className="min-h-full">
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


        {/* En-tête */}
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {error ? (
              <div>
              <h2>Dashboard</h2>
              
            </div>
            ) : user ? (
              <div>
                <h2>Dashboard</h2>
                
              </div>
            ) : (
              <p>Chargement des informations utilisateur...</p>
            )}
          </div>
        </header>

        <main>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5 mt-5">
            {error ? (
              <div className="flex flex-col items-center justify-center text-center mt-10">
                <img 
                  src="https://via.placeholder.com/150" 
                  alt="Aucune tâche" 
                  className="mb-4 w-24 h-24"
                />
                <h3 className="text-xl font-bold text-gray-700">Aucune tâche trouvée</h3>
                <p className="text-gray-500">Vous n'avez pas encore créé de tâche.</p>
                <Link 
                  to="/add_tasks" 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Ajouter une tâche
                </Link>
             </div>
            ) : tasks.length > 0 ? (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <div key={task._id} className="p-4 bg-white shadow rounded">
                    <h2 className="text-xl font-semibold">{task.title}</h2>
                    <p>{task.description}</p>
                    <p className="text-sm text-gray-600">Priorité : {task.priority}</p>
                    <p className="text-sm text-gray-600">Statut : {task.status}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </main>


      </div>
    </>
  );
}

export default Dashboard;
