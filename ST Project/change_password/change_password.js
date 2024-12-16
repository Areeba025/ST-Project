document.getElementById('changePasswordForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    // Simple validation
    if (newPassword.length < 6) {
        messageElement.textContent = "Password must be at least 6 characters long.";
        return;
    }

    if (newPassword !== confirmPassword) {
        messageElement.textContent = "New password and confirmation do not match.";
        return;
    }

    // Send data to the backend
    try {
        const response = await fetch('/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        });

        const result = await response.json();
        if (response.ok) {
            messageElement.style.color = 'green';
            messageElement.textContent = result.message;
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = result.message;
        }
    } catch (error) {
        messageElement.textContent = "An error occurred. Please try again later.";
    }
});
