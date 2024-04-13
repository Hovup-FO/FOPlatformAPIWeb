document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
});

function loadUserData() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');

    if (!accessToken || !userId) {
        console.error('Access token or user ID not found');
        return;
    }

    const url = `https://sandbox-api.foplatform.com/user/${userId}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('email').value = data.email;
        document.getElementById('name').value = data.name;
        document.getElementById('mobile').value = data.mobile;
    })
    .catch(error => {
        console.error('Error loading user data:', error);
    });
}

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const userId = localStorage.getItem('userId');
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;

    updateUser(userId, { name, mobile });
});



function updateUser(userId, userData) {
    const url = `https://sandbox-api.foplatform.com/user/${userId}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert("User information updated successfully!");
        // Redireccionar al control panel
        window.location.href = 'controlpanel.html';
    })
    .catch(error => {
        console.error("Error updating user:", error);
        alert("Error updating user information.");
    });
}




