const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()
const app = express()

app.use(express.json())

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
            .then(() => console.log("Connecting to db"))
            .catch(err => console.log("mongo running error", err))
    } catch (error) {
        console.log(error)
    }
}

app.use("/api/auth", require("./routers/Auth"))
app.use("/api/cart", require("./routers/Cart"))
app.use("/api/order", require("./routers/Order"))
app.use("/api/product", require("./routers/Product"))
app.use("/api/user", require("./routers/User"))

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port")
    connect()
})