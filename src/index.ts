import dotenv from "dotenv"
dotenv.config()
import express from  "express"
import cors from "cors"
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import eventRouter from "./routes/event.route"
import bookingRouter from "./routes/booking.route"
const app=express()
const port = Number(process.env.PORT) || 3000
const swaggerDocument = YAML.load(path.resolve(process.cwd(), "swagger.yaml"))

app.use(express.json())
app.use(cors())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use("/api/v1",eventRouter)
app.use("/api/v1",bookingRouter)

app.get("/health", (_req, res) => {
    return res.status(200).json({ status: "ok" })
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})
