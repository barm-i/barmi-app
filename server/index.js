// third parties
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
// internal modules
import connectMongoDB from './src/db/connect.js';
// api router
import { apiRouter } from './src/routes/api.js';
import { start } from 'repl';

// server configuration
dotenv.config();
const __DIRNAME = path.resolve();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// server instance
const app = express();

// set middleware
app.use(express.json());
app.use(express.static(path.join(__DIRNAME, 'public')));
app.use('/api', apiRouter());

// for test
app.get('/', (req, res) => {
    res.sendFile(path.join(__DIRNAME, 'public', 'index.html'));
});

async function startServer() {
    try {
        await connectMongoDB(DB_URI);
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log(`error while starting server : ${error.message}`)
    }
} 

startServer();