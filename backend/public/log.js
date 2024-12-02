// logout.js
const logoutUser = async () => {
    try {
      const res = await fetch('/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (res.ok) {
        // If logout is successful, clear any local storage or session data
        localStorage.removeItem('token');
        // Optionally, redirect to login page
        window.location.href = '/login'; // Redirect to login page after logout
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  // Add event listener to logout link
  document.querySelector('#logoutLink').addEventListener('click', logoutUser);
  