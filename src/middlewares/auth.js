import jwt from "jsonwebtoken"
import 'dotenv/config'

const jwt_secret = process.env.JWT_SECRET

function Token(req, res, next) {
    const token = (req.headers.authorization).replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({ message: "Acesso negado ❌" })
    }

    try {

        const decoded = jwt.verify(token, jwt_secret)

        next()

    } catch (erro) {

        return res.status(500).json({ message: "Token inválido ❌" })

    }
}

export { Token }