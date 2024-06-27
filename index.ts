import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import {connect} from 'mongoose';
import router from './src/routers';

dotenv.config();
const DB_URL = process.env.DB_URL

export const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', router);

const server = app.listen(port, async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await connect(`${DB_URL}`)
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        console.log(`Server is running on http://localhost:${port}`);
    } catch (e) {
        console.log(e, 'error start server/ error connect mongodb')
    }
});

export function closeServer() {
    return new Promise<void>((resolve, reject) => {
        server.close((err) => {
            if (err) {
                console.log('Error closing server:', err);
                reject(err);
                process.exit(1);
            } else {
                console.log('Server closed');
                resolve();
                process.exit(0);
            }
        });
    });
}
