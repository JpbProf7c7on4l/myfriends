import express from "express"
import publicRoutes from "./src/routes/public.js"
import privateRoutes from "./src/routes/private.js"
import connectBD from "./src/database/mongo.js"
import { Token } from "./src/middlewares/auth.js"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/", publicRoutes)
app.use("/", Token, privateRoutes)

connectBD(app)