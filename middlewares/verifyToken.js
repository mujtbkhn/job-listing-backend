const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]
        if (!token) {
            return res.status(404).json({ message: "unauthorized user" })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        req.userId = decodedToken.userId
        if (!decodedToken) {
            return res.status(404).json({ message: "invalid jwt token" })
        }
        next()
    } catch (error) {
        console.log("Error:", error);
        return res.status(401).json({ message: "Some error occurred" });

    }
}

module.exports = verifyToken