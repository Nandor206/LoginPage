document.querySelector(".loginform").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the form data
    const formData = new FormData(event.target);
    const username = formData.get("user");
    const password = formData.get("password");

    try {
        // Send the data to the server using fetch (no page reload)
        const response = await fetch("/validate-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Send JSON data
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json(); // Parse the server's JSON response

        if (response.ok) {
            // If login is successful, redirect to another page (e.g., home.html or dashboard)
            window.location.href = "/home";  // Redirect to /home
        } else {
            // If login fails, show error message
            alert(result.message); // Show error message
            window.location.href = "/index";
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while trying to log in. Please try again later.");
    }
});
