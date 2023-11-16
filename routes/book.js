const express = require("express");
const { createBook, viewBooks } = require("../controllers/bookController");

const bookRouter = express.Router();

bookRouter.post("/", createBook)
bookRouter.get("/", viewBooks)

module.exports = { bookRouter };
