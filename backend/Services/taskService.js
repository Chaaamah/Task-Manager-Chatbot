import TaskModel from '../Models/Task.js';

export async function getAllTasks() {
    try {
        return await TaskModel.find();
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des tâches: ${error.message}`);
    }
}

export async function addTask(taskData) {
    const task = new TaskModel(taskData);
    await task.save();
    return task;
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
        // Utiliser "find" au lieu de "findOne" pour récupérer toutes les tâches
        const tasks = await TaskModel.find({ userId: userId });
        if (tasks.length === 0) {
            throw new Error('Aucune tâche trouvée pour cet utilisateur');
        }
        return tasks; // Retourne un tableau de tâches
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des tâches par utilisateur: ${error.message}`);
    }
}