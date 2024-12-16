import * as UserService from '../Services/userService.js'

export async function getAllUsers(req, res){
    try{
        const users = await UserService.getAllUsers();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({err});
    }
}

export async function getUserById(req, res){
    try{
        const user = await UserService.getUserById(req.params.id);
        res.status(200).json(user);
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function addUser(req, res){
    try{
        const user = await UserService.addUser(req.body)
        res.status(201).json(user);
    }catch{
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export async function updateUser(req, res) {
    try{
        const User = await UserService.updateUser(req.params.id, req.body);
        res.status(200).json(User);
    }catch(err){
        res.status(500).json({err});        
    }
}

export async function deleteUser(req, res) {
    try{
        const User = await UserService.deleteUser(req.params.id);
        res.status(200).send(User)
    }catch(err){
        res.status(500).json({err});        
    }
}




export const loginUser = async (req, res) => {
    try {
      const token = await UserService.loginUser(req.body.email, req.body.password);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

export const registerUser = async (req, res) => {
    try {
      const user = await UserService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };