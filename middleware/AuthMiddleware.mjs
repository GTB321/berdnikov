import jwt from 'jsonwebtoken';
import {configDotenv} from 'dotenv';

export default class AuthMiddleware{
    static async verifyUser(req,res,next){
        try {
            console.log(req.cookie.jwt)
        } catch (error) {
            return res.status(400).json({msg:"Not working"})
        }
    }
}