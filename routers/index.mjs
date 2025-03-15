import userRouter from "./userRouter.mjs";
import { Router } from 'express';

const router = Router();

router.use('/users/',userRouter);


export default router;