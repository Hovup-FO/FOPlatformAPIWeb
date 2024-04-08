document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const userDataElement = document.getElementById('userData');
    const segmentsElement = document.getElementById('segments');

    if (!accessToken || !userId) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar información del usuario
    fetch(`https://sandbox-api.foplatform.com/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        }
    })
    .then(response => response.json())
    .then(user => {
        userDataElement.innerHTML = `
            <p>User ID: ${userId}</p>
            <p>Access Token (use it to unlock swagger): ${accessToken}</p>
            <p>Name: ${user.name}</p>
            <p>Email: ${user.email}</p>
            <p>Mobile: ${user.mobile}</p>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        userDataElement.textContent = 'We could not load the user data';
    });

 // Mostrar segmentos
fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(segments => {
    console.log(segments); // Agrega esta línea para depurar
    segmentsElement.innerHTML = `<h3>Databases: (${segments.length})</h3>`;
    segments.forEach(segment => {
        segmentsElement.innerHTML += `<p>Segment Name: ${segment.name}</p>`;
    });
})
.catch(error => {
    console.error('Error fetching segments:', error);
});


    // Configuración del botón de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            window.location.href = '../index.html'; // Nota el cambio aquí
        });
    }
});





