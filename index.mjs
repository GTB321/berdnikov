import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { configDotenv } from 'dotenv';
import db_connect from './config/db.mjs';
import router from './routers/index.mjs';

configDotenv();
db_connect(process.env.DB);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:'http://localhost:5173'}));
app.use(router)
app.listen(process.env.PORT);