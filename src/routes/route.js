const express = require('express');

const router = express.Router();

const userController = require("../controller/userController")
const bookController = require("../controller/bookController")

router.post("/register", userController.createUser)

router.post("/login",userController.userLogin )

router.post("/books",bookController.createBook)

router.get("/books",bookController.getBook)

router.get("/books/:bookId",bookController.bookById)

router.put("/books/:bookId",bookController.updateBook)

router.delete("/books/:bookId",bookController.deleteBookById)

module.exports = router;
//adding this comment for nothing