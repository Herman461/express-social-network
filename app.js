import { createServer } from 'http'
import express from "express"
import { Server } from 'socket.io'
import cors from 'cors'
import AuthController from './src/Controllers/AuthController.js'
import fs from "fs"
import jwt from 'jsonwebtoken'

const app = express()
const PORT = 4000

const checkToken = (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.sendStatus(401)
    }

    const token = req.headers.authorization.split(' ')[1]

    const fileContent = fs.readFileSync(AuthController.pathFile, 'utf8')
    const data = JSON.parse(fileContent)
    const users = data.users

    const decode = jwt.verify(token, 'super_long_signature')
    console.log(decode)
    next()
}

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const httpServer = createServer(app, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const io = new Server(httpServer)


app.post('/api/auth/register', AuthController.store)
app.post('/api/auth/login', AuthController.login)

app.get('/', checkToken, function(req, res) {
    res.send("Hello user!");
})

io.on('connection', (socket) => {
    console.log('Client connected')

    // socket.on('typing', function(data) {
    //     console.log(data)
    // })
})

httpServer.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`)
})
