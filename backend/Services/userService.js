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
    const user = await UserModel.findOne({email});
    if (!user) throw new Error('Invalid credentials');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  };

  export const registerUser = async (data) => {
    const user = new UserModel(data);
    return await user.save();
  };