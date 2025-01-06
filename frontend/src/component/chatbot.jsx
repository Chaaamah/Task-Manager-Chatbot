import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { io } from "socket.io-client";
const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "AddTask", href: "/add_tasks", current: false },
  { name: "Chatbot", href: "/chatbot", current: false },
];

const userNavigation = [
  { name: "Votre profil", href: "/profile", onclick: "" },
  { name: "Déconnexion", href: "/home", onclick: "{handleLogout}" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [setError] = useState(null);
  const [setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Se connecter au serveur WebSocket
    const socket = io("https://task-manager-chatbot.onrender.com"); // Assurez-vous que le port et l'URL sont corrects

    // Écouter les notifications des rappels de tâches
    socket.on("taskReminder", (data) => {
      console.log("Notification reçue :", data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    // Nettoyer la connexion Socket.IO lors du démontage du composant
    return () => {
      socket.disconnect();  // Déconnecter le socket lorsque le composant est démonté
    };
  }, []);

 

  const userId = localStorage.getItem("userId");
  const user = {
    id: localStorage.getItem("userId"),
    name: localStorage.getItem("userName"),
    email: localStorage.getItem("userEmail"),
  };

  if (!userId) {
    return (
      <div className="text-center mt-5">
        Erreur : Aucun utilisateur connecté. Veuillez vous connecter.
      </div>
    );
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            "https://task-manager-chatbot.onrender.com/api/chat",
            { message: input },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Réponse de l'API :", response.data);

        // Ajout des messages au tableau de conversation
        setMessages([
            ...messages,
            { role: "user", content: input },
            { role: "bot", content: response.data.reply || "Action réalisée avec succès." },
        ]);
        setInput("");
    } catch (error) {
        console.error("Erreur chatbot :", error);

        // Message d'erreur par défaut
        const errorMessage = error.response?.data?.reply || "Désolé, une erreur s'est produite. Veuillez réessayer.";

        setMessages([
            ...messages,
            { role: "user", content: input },
            { role: "bot", content: errorMessage },
        ]);
        setError(errorMessage);
    }
  };


  return (
    <div className="min-h-full">
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
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs text-white">
                          {unreadCount} 
                        </span>
                      )}
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
      <div className="flex flex-col p-12 bg-gray-100 h-screen">
        <div className="flex-grow overflow-y-auto bg-white p-7 rounded shadow-md">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded ${
                  msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Tapez votre message..."
          />
          <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-green-500 text-white rounded">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;