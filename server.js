const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // Serve files from 'public'

// Serve home page
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "home.html")); // Adjust path if needed
});

// Registration route to create users with hashed passwords
app.post("/register", [
    body("username").trim().escape(),
    body("password").trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const filePath = process.env.USERS_FILE_PATH || "users.txt";

    // Hash the password before saving it
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).json({ message: "Server error." });
        }

        // Save the username and hashed password in the users.txt file
        const userEntry = `${username}:${hashedPassword}\n`;
        fs.appendFile(filePath, userEntry, (err) => {
            if (err) {
                console.error("Error saving user:", err);
                return res.status(500).json({ message: "Server error." });
            }

            res.status(200).json({ message: "User registered successfully!" });
        });
    });
});

// Login validation route
app.post("/validate-login", [
    body("username").trim().escape(),
    body("password").trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const filePath = process.env.USERS_FILE_PATH || "users.txt";

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).json({ message: "Server error." });
        }

        const users = data.split("\n").map(line => line.trim());
        const userEntry = users.find(entry => entry.startsWith(`${username}:`));

        if (!userEntry) {
            return res.status(401).json({ message: "Username not found." });
        }

        const [, storedPass] = userEntry.split(":");
        bcrypt.compare(password, storedPass, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ message: "Server error." });
            }
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect password." });
            }

            // If the password matches, redirect to home page
            res.redirect("/home");
        });
    });
});

app.listen(process.env.PORT || 443, "0.0.0.0", () => {
    console.log(`Server running on port ${process.env.PORT || 443}`);
});
