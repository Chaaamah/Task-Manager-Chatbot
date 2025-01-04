import TaskModel from '../Models/Task.js';

export async function getAllTasks() {
    try {
        return await TaskModel.find();
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
    }
}

export async function addTask(task) {
    try {
        // Ajoutez des valeurs par défaut pour éviter les erreurs
        const taskData = {
            title: task.title ,
            description: task.description || 'No description ',
            dueDate: task.dueDate || new Date(),
            priority: task.priority || 'Medium',
            status: task.status || 'Pending',
            userId: task.userId,
        };

        return await TaskModel.create(taskData);
    } catch (error) {
        throw new Error(`Erreur lors de l'ajout de la tâche: ${error.message}`);
    }
}

export async function getTaskById(taskId) {
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            throw new Error('Tâche non trouvée');
        }
        return task;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de la tâche: ${error.message}`);
    }
}

export async function updateTask(taskId, updatedData) {
    try {
        const task = await TaskModel.findByIdAndUpdate(taskId, updatedData, { new: true });
        if (!task) {
            throw new Error('Tâche non trouvée');
        }
        return task;
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de la tâche: ${error.message}`);
    }
}

export async function deleteTask(id) {
    try {
        const task = await TaskModel.findByIdAndDelete(id);
        if (!task) {
            throw new Error('Tâche non trouvée');
        }
        return { message: 'Tâche supprimée avec succès' };
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de la tâche: ${error.message}`);
    }
}

export async function getTasksByUserId(userId) {
    try {
        // Utiliser "find" pour récupérer toutes les tâches de l'utilisateur
        const tasks = await TaskModel.find({ userId: userId });
        console.log("Tâches trouvées dans la base de données :", tasks); // Log pour déboguer
        if (tasks.length === 0) {
            throw new Error('Aucune tâche trouvée pour cet utilisateur');
        }
        return tasks; // Retourne un tableau de tâches
    } catch (error) {
        console.error("Erreur dans getTasksByUserId (service) :", error);
        throw new Error(`Erreur lors de la récupération des tâches par utilisateur: ${error.message}`);
    }
}
