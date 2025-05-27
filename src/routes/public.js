import { response, Router } from "express"
import User from "../models/User.js"
import bycript, { genSalt } from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/cadastrar", async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name) {
            return res.status(500).json({ message: "O nome do usuário precisa ser preenchido!" })
        }

        if (!email) {
            return res.status(500).json({ message: "O email do usuário precisa ser preenchido!" })
        }

        if (!password) {
            return res.status(500).json({ message: "A palavra passe do usuário precisa ser preenchido!" })
        }

        const saltRound = await bycript.genSalt(10)
        const passwordHash = await bycript.hash(password, saltRound)

        const newUser = await User.create({ name, email, password: passwordHash })

        res.status(201).json(newUser)
    } catch (erro) {
        console.log(erro)
        res.status(500).json("Erro ao cadastrar usuário ❌")
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        const jwt_secret = process.env.JWT_SECRET

        if (!email) {
            return res.status(500).json({ message: "O email do usuário precisa ser preenchido!" })
        }

        if (!password) {
            return res.status(500).json({ message: "A palavra passe do usuário precisa ser preenchido!" })
        }

        if (!user) {
            return res.status(400).json("Email não encontrado")
        }

        const isMatch = await bycript.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json("Senha errada ❌")
        }

        const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "5m" })

        res.status(200).json(token)
    } catch (erro) {
        console.log(erro)
        res.status(500).json("Erro ao fazer login ❌")
    }
})

export default router