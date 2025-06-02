import { response, Router } from "express"
import User from "../models/User.js"
import bycript, { genSalt } from "bcrypt"
import jwt from "jsonwebtoken"

const router = Router()

router.post("/cadastrar", async (req, res) => {
    try {
        const { name, email, password } = req.body
        const emailReg = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@gmail\.com$/;

        if (!name) {
            return res.status(500).json("O nome do usuário precisa ser preenchido!" )
        }

        if (!email) {
            return res.status(500).json("O email do usuário precisa ser preenchido!" )
        }

        if (!emailReg.test(email)) {
            return res.status(200).json("Insira um email válido, sem caraacteres especiais dierente de (_ - .)")
        }

        if (!password) {
            return res.status(500).json("A palavra passe do usuário precisa ser preenchido!")
        }

        const emailExist = await User.findOne({ email: email })

        if (emailExist) {
            return res.status(500).json("Esse email já está cadastrado, use outro ou faça login!")
        }

        const saltRound = await bycript.genSalt(10)
        const passwordHash = await bycript.hash(password, saltRound)

        const newUser = await User.create({ name, email, password: passwordHash })

        res.status(201).json(newUser)
    } catch (erro) {
        res.status(500).json("Erro ao cadastrar usuário ❌")
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })

        const jwt_secret = process.env.JWT_SECRET

        if (!email) {
            return res.status(500).json("O email e senha do usuário precisam ser preenchidos!")
        }

        if (!password) {
            return res.status(500).json("O email e senha do usuário precisam ser preenchidos!" )
        }

        if (!user) {
            return res.status(400).json("Usuário não encontrado, faça o seu cadastro")
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