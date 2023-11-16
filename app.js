const express = require("express");
const { connection } = require("./configs/db");
const { userRouter } = require("./routes/user");
const { logger } = require("./middlewares/logger");
const { bookRouter } = require("./routes/book");
const { authenticate } = require("./middlewares/authenticate")

const app = express()
require("dotenv").config()

app.use(express.json())
app.use(logger)

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to Library App.</h1>`);
});

app.use("/user", userRouter)

app.use(authenticate)
app.use("/books", bookRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
  try {
    await connection
    console.log("Connected to Database");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${PORT}`);
});
