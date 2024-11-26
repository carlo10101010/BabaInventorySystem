document.getElementById('changePasswordBtn').addEventListener('click', function() {
    const passwordField = document.getElementById('password');
    
    // Toggle the readonly attribute
    if (passwordField.readOnly) {
      passwordField.readOnly = false;
      passwordField.value = ''; // Clear the password field for the user to enter a new password
    } else {
      passwordField.readOnly = true;
    }
  });
  
  document.getElementById('update-btn').addEventListener('click', async function() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Here you would send the updated data to the server
    try {
      const response = await fetch('/api/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Attach JWT token
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Account updated successfully!');
        window.location.href = 'dashboard.html'; // Redirect to dashboard
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      alert('An error occurred. Please try again.');
    }
  });
  