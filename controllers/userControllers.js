const { db } = require("../config/dbConfig")
const bcrypt = require("bcrypt")
const UserModol = require("../models/user-Model")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const RegisterUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        const existing = await UserModol.getUserByEmail(email);
        // if (existing) {
        //     return res.status(400).send({
        //         msg: "Email already exists"
        //     })
        // }
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
    const { email } = req.body;
    const user = await UserModol.getUserByEmail(email);
    if (!user) {
        return res.status(404).send("Email not found")
    }
    const token = uuidv4();
    const expirAt = new Date(Date.now() + 5 * 60 * 1000);//5 min
    await UserModol.restToken(user.id, token, expiryTime)

    const link = `${process.env.CLIENT_URI}/reset-password?token=${token}`
    await sendEmail(email, "Reset password ", `<p>cleck <a href="${link}">here </a> to reset a paasword  .Link valid only 5 min</p>`)
    res.send("Reset link sent to email")
}
const resetPassword = async (req, res) => {
    const { token } = req.body;
    const user = await UserModol.getUserByresetToken(token);
    if (!user) {
        return res.status(400).send("inavlid expired link")
    }
    if (new Date(user.reset_token_exp) < new Date()) {
        return res.status(400).send("Link Expired")
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await UserModol.upDatePassword(user.id, hashPassword)

    res.send("Password updated succesfully")

}


module.exports = { RegisterUser, login, userDetails, ForgetPassword }