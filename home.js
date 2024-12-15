 document.addEventListener('DOMContentLoaded', function() {
     const logoutButton = document.getElementById('logout');

     logoutButton.addEventListener('click', function(event) {
         event.preventDefault();

         fetch('/logout', {
             method: 'GET',
             credentials: 'same-origin'
         })
         .then(response => {
             if (response.ok) {
                 window.location.href = '/';  // Redirect to login page
             } else {
                 console.error('Logout failed');
                 alert('Logout failed. Please try again.');
             }
         })
         .catch(error => {
             console.error('Error:', error);
             alert('An error occurred during logout. Please try again.');
         });
     });
 });