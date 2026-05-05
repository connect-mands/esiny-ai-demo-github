import express, {Express} from "express";
import cors from "cors"
import apiRouter from "./routes/index.js";
import { PORT } from "./config/server.config.js";
import dbConnect from "./config/dbConnect.js";

const app:Express = express()

const start = async (): Promise<void> => {
    await dbConnect()
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(cors())
    app.use("/api", apiRouter)

    app.listen(PORT,() => {
        console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`)
    })
}

start()