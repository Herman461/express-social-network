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


}

export default AuthController