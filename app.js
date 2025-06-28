const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const { connectDB } = require("./config/dbConfig")
const userRoute = require("./routes/user.route")
connectDB()


const app = express()
app.use(express.json())
app.use(express.static("public")); 

app.use("/api/v1", userRoute)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server is running on Port no.${PORT}`)



})