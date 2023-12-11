import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"
import * as argon2 from "argon2"


class AuthController {
    
    static pathFile = path.resolve() + "/users.json"

    static async store(req, res) {

        const fileContent = fs.readFileSync(AuthController.pathFile, 'utf8')
        const data = JSON.parse(fileContent)
        const users = data.users

        const {name, age, password} = req.body
        
        const hashedPassword = await argon2.hash(password)

        data.users.push({name, age, password: hashedPassword})
    
        
        fs.writeFileSync(AuthController.pathFile, JSON.stringify(data))

        res.send(users)
    }

    static async login(req, res) {
        const {name, password} = req.body
        
        const fileContent = fs.readFileSync(AuthController.pathFile, 'utf8')
        const data = JSON.parse(fileContent)
        const users = data.users

        const currentUserIndex = users.findIndex(user => user.name === name)

        if (currentUserIndex === -1) {
            return res.send('This username is not existed')
        }

        const currentUser = users[currentUserIndex]

        currentUser.token = AuthController.generateToken(currentUser)
        
        users[currentUserIndex] = currentUser
        data.users = users

        fs.writeFileSync(AuthController.pathFile, JSON.stringify(data))

        return res.send(currentUser.token)
    }

    static generateToken(user) {
        const data = {name: user.name, age: user.age}

        const signature = 'super_long_signature'
        const expiration = '6h'

        return jwt.sign(data, signature, {expiresIn: expiration})
    }
}

export default AuthController