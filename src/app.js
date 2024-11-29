import express from 'express';
import cookieParser from 'cookie-parser';
import UserRouter from './router/users.router.js';
import CharacterRouter from './router/characters.router.js';
import ItemRouter from './router/items.router.js';
import dotenv, { config } from 'dotenv';
import ErrorHandlingMiddleware from './middlewares/error-handling.middleware.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(cookieParser());

app.use('/api', [UserRouter]);
app.use('/api/character', [CharacterRouter]);
app.use('/api/item', [ItemRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요');
});
