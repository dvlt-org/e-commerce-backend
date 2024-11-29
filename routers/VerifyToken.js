const jwt = require("json-web-token")

const verifyToken = (req, res, next) => {
    const authToken = req.headers.token
    if (authToken) {
        jwt.verify(token, process.env.PASSWORD, (err, user) => {
            if (err) res.status(201).json("Token is not valid !")
            req.user = user
            next()
        })
    } else {
        res.status(401).json("You are not authorization yet !")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json("You are not allowed to do that !")
        }
    })
}

module.exports = {
    verify: verifyToken,
    verifyAdmin: verifyTokenAndAdmin,
    verifyAuth: verifyTokenAndAuthorization,
}