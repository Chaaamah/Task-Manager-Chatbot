import * as TaskService from '../Services/taskService.js'

export async function getAllTasks(req, res){
    try{
        const tasks = await TaskService.getAllTasks();
        res.status(200).json(tasks);
    }catch(err){
        res.status(500).json({err});
    }
}

export async function getTaskById(req, res){
    try{
        const task = await TaskService.getTaskById(req.params.id);
        res.status(200).json(task);
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function addTask(req, res){
    try{
        const task = await TaskService.addTask(req.body)
        res.status(201).json(task);
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateTask(req, res) {
    try{
        const Task = await TaskService.updateTask(req.params.id, req.body);
        res.status(200).json(Task);
    }catch(err){
        res.status(500).json({err});        
    }
}

export async function deleteTask(req, res) {
    try{
        const Task = await TaskService.deleteTask(req.params.id);
        res.status(200).send(Task)
    }catch(err){
        res.status(500).json({err});        
    }
}