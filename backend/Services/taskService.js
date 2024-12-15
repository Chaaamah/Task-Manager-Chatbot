import TaskModel from '../Models/Task.js'

export async function getAllTasks(){
    return await TaskModel.find();
}

export async function addTask(task){
    return await TaskModel.create(task);
}

export async function getTaskById(taskId){
    return await TaskModel.findById(taskId);
}

export async function updateTask(taskId, updatedData){
    return await TaskModel.findByIdAndUpdate(taskId, updatedData);
}

export async function deleteTask(id){
    return await TaskModel.findByIdAndDelete(id);
}

