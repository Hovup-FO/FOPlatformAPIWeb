document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('userForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userId = localStorage.getItem('userId');
        const accessToken = localStorage.getItem('accessToken');
        const oldPassword = document.getElementById('old_password').value;
        const newPassword = document.getElementById('new_password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('The passwords don’t match.');
            return;
        }

        const data = {
            old_password: oldPassword,
            new_password: newPassword
        };

        const url = `https://sandbox-api.foplatform.com/user/change-password/${userId}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to change password: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert("Password changed successfully!");
            window.location.href = 'controlpanel.html';
        })
        .catch(error => {
            console.error("Error changing password:", error);
            alert("Error changing password. Please try again.");
        });
    });

    document.getElementById('showPassword').addEventListener('change', function() {
        const oldPasswordInput = document.getElementById('old_password');
        const newPasswordInput = document.getElementById('new_password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (this.checked) {
            oldPasswordInput.type = 'text';
            newPasswordInput.type = 'text';
            confirmPasswordInput.type = 'text';
        } else {
            oldPasswordInput.type = 'password';
            newPasswordInput.type = 'password';
            confirmPasswordInput.type = 'password';
        }
    });
});
