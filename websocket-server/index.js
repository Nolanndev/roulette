import cors from 'cors';
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';

const data = Low(new JSONFile('db.json'));

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors())

app.get('/', (req, res) => {
    console.log(join(__dirname, 'index.html'))
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('connexion', (data) => {
        console.log(data);
        io.emit('connexion', {
            message: `connexion validee pour ${data.username}`,
            timestamp: new Date().toISOString()
        });
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});