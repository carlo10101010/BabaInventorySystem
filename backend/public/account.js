document.getElementById('update-btn').addEventListener('click', async function () {
  const token = localStorage.getItem('auth-token');
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  // Check if userId exists
  if (!userId) {
    alert('User ID is missing. Please log in again.');
    window.location.href = 'login.html'; // Redirect to login page if userId is missing
    return;
  }

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validation to ensure username and email are provided
  if (!username || !email) {
    alert('Username and email are required.');
    return;
  }

  const updateData = { username, email };
  if (password) {
    updateData.password = password; // Include password if changed
  }

  try {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Attach JWT token for authorization
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Account updated successfully!');
      window.location.href = 'dashboard.html'; // Redirect to dashboard after successful update
    } else {
      alert(data.message || 'Update failed');
    }
  } catch (error) {
    console.error('Error updating account:', error);
    alert('An error occurred. Please try again.');
  }
});
