const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data (e.g., from HTML forms)

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname))); // Adjust the path if necessary

// Serve home page directly for /home
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));  // Make sure 'home.html' exists in the current folder
});

// Endpoint to validate login
app.post("/validate-login", (req, res) => {
    const { username, password } = req.body;
    const filePath = path.join(__dirname, "users.txt");

    // Read users.txt and validate credentials
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return res.status(500).json({ message: "Server error." });
        }

        const users = data.split("\n").map(line => line.trim());
        console.log("Users in file:", users);

        const userEntry = users.find(entry => entry.startsWith(`${username}:`));
        console.log("Looking for username:", username);

        if (!userEntry) {
            return res.status(401).json({ message: "Username not found." });
        }

        const [, storedPass] = userEntry.split(":");
        if (storedPass !== password) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        // If credentials are correct, send a success message
        res.redirect("/home") 
    });
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
