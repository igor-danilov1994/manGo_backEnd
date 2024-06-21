import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import {connect} from 'mongoose';
import router from './routers/index';

dotenv.config();
const DB_URL = process.env.DB_URL

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', router);

// Запуск сервера
app.listen(port, async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await connect(`${DB_URL}`)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        console.log(`Server is running on http://localhost:${port}`);
    } catch (e) {
        console.log(e, 'error start server/ error connect mongodb')
    }
});
