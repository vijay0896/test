const { db } = require("../config/dbConfig")
const bcrypt = require("bcrypt")
const UserModol = require("../models/user-Model")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const sendEmail = require("../utils/sendEmail");
const RegisterUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const existing = await UserModol.getUserByEmail(email);
        if (existing) {
            return res.status(400).send({
                msg: "Email already exists"
            })
        }
        const saltRound = 10;
        const hashPassword = await bcrypt.hash(password, saltRound);
        await UserModol.CreateUser(first_name, last_name, email, hashPassword)
        res.status(201).send({
            msg: "user created Succesfully",

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "server erorr"
        })

    }


}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModol.getUserByEmail(email)


        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).send({
                msg: "Invalid Crediantcial"
            })
        }
        const token = jwt.sign({ id: user.id },
            process.env.JWT_SCRET
        )
        res.json({ token })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: "server erorr on login "
        })

    }
}
const userDetails = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await UserModol.getuserDetails(userId);
        if (!user) {
            return res.status(404).send("User not found")
        }
        res.json({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            msg: "Server erorr on Get Profile api"
        })

    }



}

const ForgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // check user exists
        const user = await UserModol.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }

        // create token
        const token = uuidv4();
        const expirAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // save token in DB
        await UserModol.restToken(user.id, token, expirAt);

        // send reset link
        const link = `${process.env.CLIENT_URI}?token=${token}`;
        await sendEmail(
            email,
            "Reset password",
            `<p>Click <a href="${link}">here</a> to reset your password.<br/>Link valid only 5 minutes.</p>`
        );

        res.status(200).json({ message: "Reset link sent to email" });

    } catch (error) {
        console.error("ForgetPassword Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const user = await UserModol.getUserByresetToken(token);
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired link" });
        }

        if (new Date(user.reset_token_exp) < new Date()) {
            return res.status(400).json({ error: "Link expired" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await UserModol.upDatePassword(user.id, hashPassword);

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("ResetPassword Error:", error.message);
        res.status(500).json({ error: "Something went wrong while resetting password" });
    }
};


module.exports = { RegisterUser, login, userDetails, ForgetPassword, resetPassword }