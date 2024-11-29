const express = require("express")
const User = require("../models/Users")
const Crypto = require("crypto-js")
const jwt = require("json-web-token")

const router = express.Router()


router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: Crypto.AES.encrypt(req.body.password, process.env.PASSWORD).toString(),
        email: req.body.email,
    })
    try {
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        !user && res.status(404).json({ message: "Wrong information !" })

        const hashedPassword = Crypto.AES.decrypt(user.password, process.env.PASSWORD)
        const originalPassword = hashedPassword.toString(Crypto.enc.Utf8);

        originalPassword !== req.body.password &&
            res.status(404).json({ message: "Wrong information !" })

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        })

        const { password, ...others } = user._doc
        res.status(201).json({
            user: {
                ...others,
                accessToken,
            }
        })
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router