import mongoose from "mongoose"
import "dotenv/config"

const urlDB = process.env.MONGO_URL

async function connectBD(app)
{
    try {
        await mongoose.connect(urlDB)
        app.listen(4000, () => console.log("Servidor ligado 🚀 & banco de dados conectado 🔥"))
    } catch(erro) {
        console.log("Erro ao connectar ao banco de dados!")
    }
}

export default connectBD