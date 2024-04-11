import express from 'express';
import path from 'path';
import { apiRouter } from './src/routes/api.js';

// configuration
const PORT = 3000;
const __DIRNAME = path.resolve();


const app = express();

// set middleware
app.use(express.json());
app.use(express.static(path.join(__DIRNAME, 'public')));
app.use('/api', apiRouter());

// for test
app.get('/', (req, res) => {
    res.sendFile(path.join(__DIRNAME, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})