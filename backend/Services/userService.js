import UserModel from '../Models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function getAllUsers() {
    try {
        return await UserModel.find();
    } catch (error) {
        throw new Error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    }
}

export async function addUser(user) {
    try {
        return await UserModel.create(user);
    } catch (error) {
        throw new Error(`Erreur lors de l'ajout de l'utilisateur: ${error.message}`);
    }
}

export async function getUserById(id) {
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    } catch (error) {
        throw new Error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
    }
}

export async function updateUser(id, updatedData) {
    try {
        const user = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    } catch (error) {
        throw new Error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
    }
}

export async function deleteUser(id) {
    try {
        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
        throw new Error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
    }
}

export async function loginUser(email, password) {
    try {
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
    } catch (error) {
        throw new Error(`Erreur lors de la connexion de l'utilisateur: ${error.message}`);
    }
}

export async function registerUser(data) {
    try {
        const user = new UserModel(data);
        return await user.save();
    } catch (error) {
        throw new Error(`Erreur lors de l'enregistrement de l'utilisateur: ${error.message}`);
    }
}