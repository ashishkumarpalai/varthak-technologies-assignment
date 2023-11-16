const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/userModel");
require("dotenv").config()

const userRouter = express.Router();

userRouter.post("/signup", async (req, res, next) => {
    try {
        const { username, password, roles } = req.body;

        // Check if the password field exists
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Hash the user's password before saving it to the database.
        const hash = await bcrypt.hash(password, 10);

        const isExisting = await userModel.findOne({ username });

        if (isExisting) {
            return res
                .status(400)
                .json({ message: "User already exists, please login" });
        } else {
            // Create a new user document with the hashed password.
            const newUser = new userModel({ username, password: hash, roles });
            await newUser.save();

            // User registration successful.
            return res.status(201).json({ message: "New user registered" });
        }
    } catch (err) {
        console.error("Error during user registration:", err);
        return res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
    }
});
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });

        if (user) {
            // Compare the provided password with the hashed password in the database.
            const passwordsMatch = await bcrypt.compare(password, user.password);

            if (passwordsMatch) {
                // Create a JWT token for the user's successful login.
                const token = jwt.sign({ userID: user._id, role: user.roles }, process.env.secretKey, {
                    expiresIn: "1h",
                });
                // Successful login, return a token.
                res.json({ message: "Logged in", token: token });
            } else {
                // Password does not match.
                res.status(401).json({ message: "Wrong password" });
            }
        } else {
            res.status(401).json({ message: "Wrong credentials" });
        }
    } catch (err) {
        res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
    }
})

module.exports = { userRouter };
