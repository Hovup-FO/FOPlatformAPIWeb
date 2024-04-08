document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const userDataElement = document.getElementById('userData');

    if (accessToken && userId) {
        fetch(`https://sandbox-api.foplatform.com/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(user => {
            userDataElement.innerHTML = `
                <p>ID de Usuario: ${userId}</p>
                <p>Access Token: ${accessToken}</p>
                <p>Nombre: ${user.name}</p>
                <p>Email: ${user.email}</p>
                <p>Móvil: ${user.mobile}</p>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
            userDataElement.textContent = 'No se pudieron cargar los datos del usuario';
        });
    } else {
        window.location.href = 'login.html';
    }

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        window.location.href = 'index.html';
    });
});


