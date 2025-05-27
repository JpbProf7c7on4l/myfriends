import { Router } from "express"
import User from "../models/User.js"

const router = Router()

router.get("/listar-usuarios", async (req, res) => {
    try {
        const users = await User.find({})

        res.status(200).json(users)
    } catch (erro) {
        res.status(500).json("Erro ao listar usuários")
    }
})

export default router