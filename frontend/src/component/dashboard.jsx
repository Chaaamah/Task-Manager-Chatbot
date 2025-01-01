import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Disclosure,
  Menu,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  const navigation = [
    { name: "Tableau de bord", href: "#", current: true },
    { name: "Tâches", href: "#", current: false },
    { name: "Paramètres", href: "#", current: false },
  ];

  const user = {
    name: "Nelle Kelly",
    email: "nelle.kelly@example.com",
    imageUrl: "https://via.placeholder.com/150",
  };

  const userNavigation = [
    { name: "Votre profil", href: "#" },
    { name: "Déconnexion", href: "#" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des tâches :", error);
        setError("Impossible de charger les tâches.");
      });
  }, []);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
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
                  <div className="shrink-0">
                    
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                    <Link to="/dashboard" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                      Dashboard
                    </Link>

                    <Link to="/add_tasks" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
                      Tasks
                    </Link>

                    <Link to="/add_tasks" className="bg-gray-900 text-white text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium">
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
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
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

      {/* En-tête */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Tableau de bord
          </h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5 mt-5">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
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
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
