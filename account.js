document.addEventListener('DOMContentLoaded', () => {
    const savePasswordButton = document.getElementById('savePasswordButton');

    savePasswordButton.addEventListener('click', () => {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        // Placeholder logic for changing password
        // Replace this with actual API call logic
        console.log("Changing password...");
        console.log("Current Password:", currentPassword);
        console.log("New Password:", newPassword);

        // Reset form and close modal
        alert("Password changed successfully!");
        document.getElementById('changePasswordForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();
    });
});
