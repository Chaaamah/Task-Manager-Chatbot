import React, { useEffect, useState } from "react";
import axios from "axios";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, PencilIcon, TrashIcon, CheckIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { io } from "socket.io-client";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: true },
    { name: "AddTask", href: "/add_tasks", current: false },
    { name: "Chatbot", href: "/chatbot", current: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const userNavigation = [
    {
      name: "Votre profil",
      href: "/profile",
      onClick: () => navigate("/profile", { state: { user } }),
    },
    { name: "Déconnexion", href: "/", onClick: handleLogout },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("taskReminder", (data) => {
      console.log("Notification reçue :", data);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        data,
      ]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  useEffect(() => {
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

    axios
      .get(`http://localhost:5000/api/tasks/user/${storedUser.id}`)
      .then((response) => {
        setTasks(response.data);
        setFilteredTasks(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des tâches :", error);
        setError("Impossible de charger les tâches.");
      });

    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      });
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(task => {
        const taskDueDate = new Date(task.dueDate).toISOString().split('T')[0];
        const selectedDate = new Date(dateFilter).toISOString().split('T')[0];
        return taskDueDate === selectedDate;
      });
    }

    setFilteredTasks(filtered);
  }, [searchTerm, priorityFilter, statusFilter, dateFilter, tasks]);

  const taskStatusData = [
    { name: "Pending", value: tasks.filter(task => task.status === "Pending").length },
    { name: "In Progress", value: tasks.filter(task => task.status === "In Progress").length },
    { name: "Completed", value: tasks.filter(task => task.status === "Completed").length },
  ];

  const taskPriorityData = [
    { name: "High", value: tasks.filter(task => task.priority === "High").length },
    { name: "Medium", value: tasks.filter(task => task.priority === "Medium").length },
    { name: "Low", value: tasks.filter(task => task.priority === "Low").length },
  ];

  const COLORS = ["#FFBB28", "#00C49F", "#0088FE"];

  const getUserNameById = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Utilisateur inconnu";
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      axios
        .delete(`http://localhost:5000/api/tasks/${taskId}`)
        .then(() => {
          setTasks(tasks.filter(task => task._id !== taskId));
          setFilteredTasks(filteredTasks.filter(task => task._id !== taskId));
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression de la tâche :", error);
        });
    }
  };

  const handleSaveTask = async (taskId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, editedTask);
      const updatedTasks = tasks.map((task) =>
        task._id === taskId ? response.data : task
      );
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setEditingTaskId(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  };

  return (
    <>
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

                  <div className="absolute top-16 right-0 z-10 w-64 bg-white shadow-lg py-1 rounded-md">
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 text-sm text-gray-700 border-b"
                        >
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-xs text-gray-500">
                            Échéance : {new Date(notification.dueDate).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                       <div className="px-4 py-2 text-sm text-gray-500">
                      Aucune nouvelle notification.
                      </div>
                      )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearNotifications}
                        className="w-full text-center text-sm text-gray-500 hover:bg-gray-100 px-4 py-2"
                      >
                        Effacer tout
                      </button>
                    )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Tasks by Status</h3>
                <PieChart width={400} height={300}>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
              <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
                <BarChart width={400} height={300} data={taskPriorityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </div>
            </div>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All statuts</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            {error ? (
              <div className="flex flex-col items-center justify-center text-center mt-10">
                <img 
                  src="https://via.placeholder.com/150" 
                  alt="Aucune tâche" 
                  className="mb-4 w-24 h-24"
                />
                <h3 className="text-xl font-bold text-gray-700">No tasks found</h3>
                <p className="text-gray-500">You have not created a task yet.</p>
                <Link 
                  to="/add_tasks" 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Task
                </Link>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <div key={task._id} className="p-6 bg-white shadow-lg rounded-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    {editingTaskId === task._id ? (
                      <div>
                        <input
                          type="text"
                          value={editedTask.title || task.title}
                          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                          className="w-full p-2 mb-2 border rounded"
                        />
                        <textarea
                          value={editedTask.description || task.description}
                          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                          className="w-full p-2 mb-2 border rounded"
                        />
                        <select
                          value={editedTask.priority || task.priority}
                          onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                          className="w-full p-2 mb-2 border rounded"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <select
                          value={editedTask.status || task.status}
                          onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                          className="w-full p-2 mb-2 border rounded"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleSaveTask(task._id)}
                            className="text-green-500 hover:text-green-700"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h2>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <div className="flex items-center mb-3">
                          <span className="text-sm font-medium text-gray-500">Priority :</span>
                          <span
                            className={`ml-2 text-sm font-semibold ${
                              task.priority === "High"
                                ? "text-red-600"
                                : task.priority === "Medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          <span className="text-sm font-medium text-gray-500">Statut :</span>
                          <span
                            className={`ml-2 text-sm font-semibold ${
                              task.status === "Pending"
                                ? "text-red-600"
                                : task.status === "In Progress"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          <span className="text-sm font-medium text-gray-500">Due date :</span>
                          <span className="ml-2 text-sm text-gray-600">
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingTaskId(task._id);
                              setEditedTask({ ...task });
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center mt-10">
                <img 
                  src="https://via.placeholder.com/150" 
                  alt="Aucune tâche" 
                  className="mb-4 w-24 h-24"
                />
                <h3 className="text-xl font-bold text-gray-700">Aucune tâche trouvée</h3>
                <p className="text-gray-500">Aucune tâche ne correspond à vos critères de recherche.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;