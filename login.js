document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const loginPopup = document.getElementById('loginPopup');
    const closeBtn = document.querySelector('.close');

    // Check login state on page load
    const username = localStorage.getItem('username');
    if (username) {
        loginBtn.textContent = 'Logout';
        document.getElementById('welcomeMessage').textContent = `Welcome, ${username}!`;
    }

    loginBtn.addEventListener('click', () => {
        if (localStorage.getItem('username')) {
            // Logout
            localStorage.removeItem('username');
            loginBtn.textContent = 'Login';
            document.getElementById('welcomeMessage').textContent = 'Welcome, Anonymous!';
        } else {
            // Show login popup
            loginPopup.style.display = 'block';
        }
    });

    closeBtn.addEventListener('click', () => {
        loginPopup.style.display = 'none';
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            const response = await fetch('/validate-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                // If login is successful, store username and redirect
                localStorage.setItem('username', username);
                window.location.href = '/home';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while trying to log in. Please try again later.');
        }
    });
});

