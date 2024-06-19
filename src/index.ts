import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Инициализация переменных окружения
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Example route
app.get('/', (req, res) => {
    res.send('Hello Wordddddld!');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
