const user = require("../models/user");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const registeredUser = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                message: "Bad Request"
            });
        }

        const existingUser = await user.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = new user({
            name,
            email,
            password: hashedPassword,
            mobile
        });

        await userData.save();

        res.json({
            message: "User registered successfully"
        });
    } catch (error) {
        next(error)

    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).json({
                message: "email or password is empty"
            })
        }
        const userDetails = await user.findOne({ email })
        if (!userDetails) {
            return res.status(404).json({
                message: "Invalid email"
            })
        }

        const passwordMatch = await bcrypt.compare(
            password,
            userDetails.password
        )
        if (!passwordMatch) {
            return res.status(404).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign({ userId: userDetails._id, name: userDetails.name }, process.env.SECRET_KEY)
        res.json({
            message: "user logged in successfully",
            token: token
        })

    } catch (error) {
        next(error)

    }
}
module.exports = { registeredUser, loginUser };
