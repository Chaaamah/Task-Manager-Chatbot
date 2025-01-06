import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Profil = () => {
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const [success, setSuccess] = useState(null); // Pour afficher un message de succès

  // Récupérer les données de l'utilisateur actuel au chargement du composant
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Utilisateur non connecté.");
      return;
    }

    // Récupérer les informations de l'utilisateur depuis l'API
    axios
      .get(`https://task-manager-chatbot.onrender.com/api/users/${userId}`)
      .then((response) => {
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        setError("Impossible de charger les informations de l'utilisateur.");
      });
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Utilisateur non connecté.");
      return;
    }

    try {
      // Mettre à jour les informations de l'utilisateur via une API
      /*const response = await axios.patch(
        `https://task-manager-chatbot.onrender.com/api/users/${userId}`,
        { name, email, password }
      );*/

      // Afficher un message de succès
      setSuccess("Informations mises à jour avec succès !");
      setError(null);

      // Mettre à jour les données dans localStorage
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);

      // Rediriger vers le Dashboard après la mise à jour
      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      if (error.response) {
        if (error.response.status === 404) {
          setError("Utilisateur non trouvé.");
        } else {
          setError("Une erreur s'est produite lors de la mise à jour.");
        }
      } else {
        setError("Problème de connexion au serveur.");
      }
      setSuccess(null);
    }
  };

  // Gestion de la suppression du compte
  const handleDeleteAccount = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("Utilisateur non connecté.");
        return;
      }

      try {
        // Supprimer le compte via une API
        await axios.delete(`https://task-manager-chatbot.onrender.com/api/users/${userId}`);

        // Supprimer les données de l'utilisateur de localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        // Rediriger vers la page d'accueil
        navigate("/");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte :", error);
        if (error.response) {
          if (error.response.status === 404) {
            setError("Utilisateur non trouvé.");
          } else {
            setError("Une erreur s'est produite lors de la suppression du compte.");
          }
        } else {
          setError("Problème de connexion au serveur.");
        }
      }
    }
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  // Navigation principale
  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "AddTask", href: "/add_tasks", current: false },
    { name: "Chatbot", href: "/chatbot", current: false },
  ];

  // Navigation utilisateur
  const userNavigation = [
    { name: "Votre profil", href: "/profile", onClick: () => {} },
    { name: "Déconnexion", href: "/", onClick: handleLogout },
  ];

  // Fonction pour gérer les classes conditionnelles
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <>
      <div className="min-h-full">
        {/* Barre de navigation */}
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
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
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">Voir les notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
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
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
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
                      <div className="text-base font-medium text-white">{name || "Utilisateur"}</div>
                      <div className="text-sm font-medium text-gray-400">{email || "email@example.com"}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as={Link}
                        to={item.href}
                        onClick={item.onClick}
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

        {/* Contenu principal */}
        <main>
          <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Profil Utilisateur
            </h2>

            {/* Affichage des messages d'erreur ou de succès */}
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
                {success}
              </div>
            )}

            {/* Formulaire de mise à jour des informations */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champ pour le nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom:
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Champ pour l'email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Champ pour le mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bouton pour mettre à jour les informations */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Mettre à jour
              </button>
            </form>

            {/* Bouton pour supprimer le compte */}
            <button
              onClick={handleDeleteAccount}
              className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Supprimer le compte
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profil;