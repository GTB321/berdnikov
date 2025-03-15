import bcrypt from 'bcrypt';
import { User } from '../models/User.mjs';
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export default class UserController {
    static async create(req, res) {
        try {
            const { login, password } = req.body;
            
            // Проверка на существующего пользователя
            const existingUser = await User.findOne({ login });
            if (existingUser) {
                return res.status(409).json({ msg: 'Пользователь уже существует' });
            }

            const hashed = await bcrypt.hash(password, 10); // Рекомендуется salt = 10
            
            const user = new User({
                login,
                password: hashed
            });
            
            await user.save();
            return res.status(201).json({ msg: 'Зарегистрировался' });
        } catch (error) { 
            return res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { login, password } = req.body;
            const finded = await User.findOne({ login });
            
            if (!finded) {
                return res.status(404).json({ msg: "Пользователь не найден" });
            }
            
            const findByPass = await bcrypt.compare(password, finded.password); 
            if (!findByPass) {
                return res.status(401).json({ msg: "Неверный пароль" }); // Исправлен статус на 401
            }
            
            const payload = {
                id: finded._id
            };
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '12h' });
            
            // Исправлено вычисление даты экспирации
            res.cookie('jwt', token, { 
                httpOnly: true, 
                expires: new Date(Date.now() + 1000 * 60 * 60 * 12) 
            }); 
            
            return res.status(200).json({ msg: 'Успешный вход'});
        } catch (error) { 
            return res.status(500).json({ error: error.message });
        }
    }

    static async profile(req, res) {
        try {
            // Предполагаем, что middleware аутентификации добавил пользователя в req.user
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ msg: 'Пользователь не найден' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    static async logout(req, res) {
        try {
            // Добавлены параметры куки для корректного удаления
            res.clearCookie('jwt', { httpOnly: true });
            return res.status(200).json({ msg: "Logged out" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}