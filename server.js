require("dotenv").config()
// console.log(process.env.MONGO_URI);
const express = require("express")
const PORT = 3000
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const jobRoute = require("./routes/job")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/job", jobRoute)

app.use("*", (req, res) => {
    res.status(404).json({
        message: "route not found"
    })
})

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).json({
        ErrorMessage: "something went wrong"
    })
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB Failed to connect", err))



app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})