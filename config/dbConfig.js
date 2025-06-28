const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB

});
// module.exports=db;
async function connectDB() {
    try {
        const connect = await db.getConnection();
        console.log("MySQL connected")
        connect.release();

    } catch (error) {
        console.log("error while connecting database")

    }

}

module.exports = { db, connectDB };