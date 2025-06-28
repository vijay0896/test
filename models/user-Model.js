const { db } = require("../config/dbConfig")

//Create a new user
const CreateUser = async (first_name, last_name, email, password) => {
    const [result] = await db.query(`INSERT INTO users(first_name,last_name,email,password) VALUES (?,? ,?,?)`, [first_name, last_name, email, password]);
    return result;


}
const getUserByEmail = async (email) => {
    const [rows] = await db.query(`SELECT * FROM users WHERE email =?`, [email])
    return rows[0]


}
const getuserDetails = async (userId) => {
    const [user] = await db.query(`SELECT * FROM users WHERE id =?`, [userId])
    return user[0]



}
const upDatePassword = async (userId, password) => {
    const [result] = await db.query(`UPDATE users SET password=?,rest_token=NULL, reset_token_exp=NULL WHERE id=?`, [password, userId])
    return result;


}

const restToken = async (userId, token, expiryTime) => {
    const [result] = await db.query(
        `UPDATE users SET rest_token=?, reset_token_exp=? WHERE id=?`,
        [token, expiryTime, userId]
    );
    return result;

}
const getUserByresetToken = async (token) => {
    const [rows] = await db.query(`SELECT * from users WHERE rest_token=? `, [token])
    return rows[0];

}
module.exports = { CreateUser, getUserByEmail, getuserDetails, upDatePassword, restToken, getUserByresetToken }