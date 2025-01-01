import UserModel from '../Models/User.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function getAllUsers(){
    return await UserModel.find();
}

export async function addUser(user){
    return await UserModel.create(user);
}

export async function getUserById(id){
    return await UserModel.findById(id);
}

export async function updateUser(id, updatedData){
    return await UserModel.findByIdAndUpdate(id, updatedData);
}

export async function deleteUser(id){
    return await UserModel.findByIdAndDelete(id);
}



export const loginUser = async (email, password) => {
    // Rechercher l'utilisateur par email
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
  
    // Vérifier si le mot de passe correspond
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
  
    // Générer un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    // Retourner le token et les informations utilisateur
    return { 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    };
  };
  

  export const registerUser = async (data) => {
    const user = new UserModel(data);
    return await user.save();
  };