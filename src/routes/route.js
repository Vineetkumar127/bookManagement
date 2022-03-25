const express = require('express');
//const mongoose = require('mongoose')
const router = express.Router();

const userController = require("../controller/userController")

router.post("/createUser", userController.createUser)



module.exports = router;