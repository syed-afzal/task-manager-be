import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth"
import taskRoutes from "./routes/tasks"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URI);
app.use(cors())
app.use(express.json())

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

