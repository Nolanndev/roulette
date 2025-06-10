import cors from 'cors';
import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const db = new Low(new JSONFile('data.json'), "");
db.read()
console.log("gData", db)
console.log("gData", db.data)

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
const SECRET = "MonSuperSecretDeLaMortQuiTue"
const tokens = {}
const codes = []

app.use(cors())

app.get('/', (req, res) => {
    console.log(join(__dirname, 'index.html'))
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('connexion', (data) => {
        if (db.data.utilisateurs[data.username] && db.data.utilisateurs[data.username]["motDePasse"] === data.password) {
            let token = jwt.sign({ id: socket.id, date: Date.now() }, SECRET)
            tokens[`_${socket.id}`] = token
            if (db.data.utilisateurs[data.username]["type"] === "formateur") {
                // Créer un id pour une room
                io.emit('connexion', {
                    success: true,
                    goTo: 'formateur',
                    token: token
                })
            } else {
                // Renvoyer un succès et afficher la page de saisie du code de jeu
                io.emit('connexion', {
                    success: true,
                    goTo: 'etudiant',
                    token: token
                })
            }
        } else {
            io.emit('connexion', {
                success: false,
                message: `Le nom d'utilisateur ou le mot de passe est incorrecte`
            })
        }
    })

    socket.on('verif-token', (token) => {
        // vérifier si le token fournit est le même que celui en mémoire
        if (tokens[`_${socket.id}`] == token) {
            socket.emit('verif-token', true)
        } else {
            socket.emit('verif-token', false)
        }
    })

    socket.on('classes-formateur', (data) => {
        if (db.data['utilisateurs'] && db.data.utilisateurs[data.username] && db.data.utilisateurs[data.username].type == 'formateur') {
            socket.emit('classes-formateur', {
                success: true,
                classes: db.data.utilisateurs[data.username]["classes"]
            })
        } else {
            socket.emit('classes-formateur', {
                success: false
            })
        }
    })

    socket.on('demarrer-partie', (data) => {
        
        socket.join(`${data.formateur}_${data.classe}`)
        let _code = genererCodePartie()
        console.log(_code)
        socket.emit('demarrer-partie', {
            success: true,
            code: _code
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Générer un code de partie pour 
function genererCodePartie(taille) {
    console.log('genererCodePartie()')
    let code;
    do {
        console.log('regénération d\'un nouveau code')
        code = ''
        Array.from({ taille }).some(() => {
           code += Math.random().toString(36).slice(2)
           return code.length >= taille
       });
       code = code.slice(0, taille)
    } while (codes.find(e => e == code) != undefined)
    codes.push(code)
    return code
}

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});