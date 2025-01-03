import * as TaskService from '../Services/taskService.js';

export async function getAllTasks(req, res) {
    try {
        const tasks = await TaskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ err });
    }
}

export async function getTaskById(req, res) {
    try {
        const task = await TaskService.getTaskById(req.params.id);
        res.status(200).json(task);
    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function addTask(req, res) {
    try {
        const task = await TaskService.addTask(req.body);
        res.status(201).json(task); // Retourne la tâche créée
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la tâche.' });
    }
}

export async function updateTask(req, res) {
    try {
        const task = await TaskService.updateTask(req.params.id, req.body);
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ err });
    }
}

export async function deleteTask(req, res) {
    try {
        const task = await TaskService.deleteTask(req.params.id);
        res.status(200).send(task);
    } catch (err) {
        res.status(500).json({ err });
    }
}

export async function getTasksByUserId(req, res) {
    try {
        const userId = req.params.userId;
        const tasks = await TaskService.getTasksByUserId(userId);
        if (tasks.length > 0) {
            res.status(200).json(tasks);
        } else {
            res.status(404).json({ message: 'Aucune tâche trouvée pour cet utilisateur' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}