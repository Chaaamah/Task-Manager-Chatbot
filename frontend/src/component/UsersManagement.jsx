import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger la liste des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des utilisateurs.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const handleDelete = async (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        setUsers(users.filter((user) => user.id !== userId)); // Mettre à jour la liste
      } catch (err) {
        setError("Erreur lors de la suppression de l'utilisateur.");
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
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
        <h2>Gestion des utilisateurs</h2>
        <Link to="/add-user" className="btn btn-primary mb-3">
            Ajouter un utilisateur
        </Link>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    <Link to={`/edit-user/${user.id}`} className="btn btn-sm btn-warning me-2">
                    Modifier
                    </Link>
                    <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-sm btn-danger"
                    >
                    Supprimer
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>  
  );
}

export default UsersManagement;