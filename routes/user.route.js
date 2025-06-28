const express = require("express")
const router = express.Router()
const userController = require("../controllers/userControllers")
const auth =require("../middleware/authMiddleware")

router.post("/register", userController.RegisterUser)
router.post("/login", userController.login)
router.get("/getUser/:id",auth, userController.userDetails)
module.exports = router