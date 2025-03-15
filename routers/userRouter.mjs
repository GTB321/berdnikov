import {Router} from 'express';
import UserController from '../controllers/UserController.mjs';

const userRouter = Router();

userRouter.post('/create', UserController.create);
userRouter.post('/login', UserController.login);
userRouter.get('/profile',UserController.profile);
userRouter.post('/logout',UserController.logout);

export default userRouter;