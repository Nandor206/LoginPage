const express = require("express");
const fs = require("fs");
const path = require("path");
const expressSession = require("express-session"); // Import express-session for session management

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data (e.g., from HTML forms)

// Session setup
app.use(
  expressSession({
    secret: 'your-secret-key', // Use a random string as the secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next(); // User is logged in, continue to the next middleware/route
  } else {
    return res.redirect('/'); // Redirect to login page if not logged in
  }
}

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname))); // Adjust the path if necessary

// Serve login page (index.html) when visiting /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html")); // Serve the login page
});

// Serve home page directly for /home, but require authentication first
app.get('/home', isAuthenticated, (req, res) => {
    // Send the home.html file with the username as a query parameter
    res.redirect(`/home.html?username=${encodeURIComponent(req.session.username)}`);
});

// Add a route to serve home.html
app.get('/home.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});


// Endpoint to validate login
app.post("/validate-login", (req, res) => {
  const { username, password } = req.body;
  const filePath = path.join(__dirname, "users.txt");

  // Read users.txt and validate credentials
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }

    const users = data.split("\n").map((line) => line.trim());
    const userEntry = users.find((entry) => entry.startsWith(`${username}:`));

    if (!userEntry) {
      return res.status(401).json({ success: false, message: "Username not found." });
    }

    const [, storedPass] = userEntry.split(":");
    if (storedPass !== password) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    // If credentials are correct, set session variable and send success response
    req.session.loggedIn = true;
    req.session.username = username;
    res.json({ success: true, message: "Login successful", username: username });
  });
});



// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out." });
    }
    res.redirect("/"); // Redirect to login page after logout
  });
});

app.listen(443, "0.0.0.0", () => {
  console.log("Server running on port 443");
});
