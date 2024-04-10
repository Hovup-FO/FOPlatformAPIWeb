document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const userDataElement = document.getElementById('userData');
    const segmentsElement = document.getElementById('segments');
    const segmentsSelect = document.getElementById('segmentsSelect');
    const membershipSelect = document.getElementById('membershipSelect');
   


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
            <h4>Project Name: ${user.name}</h4>
            <p>Email: ${user.email}</p>
            <p>Mobile: ${user.mobile}</p>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
        userDataElement.textContent = 'We could not load the user data';
    });

 // Mostrar segmentos
fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}?page=1&no_items=10&removed=false`, {
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
        segmentsElement.innerHTML += `<h4>Segment Name: ${segment.name}</h4>`;
        segmentsElement.innerHTML += `<p>Segment ID: ${segment.id}</p>`;
    });
})
.catch(error => {
    console.error('Error fetching segments:', error);
});


 // Mostrar Custom Fields
 membershipSelect.addEventListener('change', function() {
    const membershipId = this.value;
    if (membershipId) {
        fetch(`https://sandbox-api.foplatform.com/membership-custom-field/list/${membershipId}?page=1&no_items=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => response.json())
        .then(customFields => {
            const customFieldsElement = document.getElementById('customFields');
            customFieldsElement.innerHTML = `<h3>Custom Fields: (${customFields.length})</h3>`;
            customFields.forEach(customField => {
                customFieldsElement.innerHTML += `<h4>Custom Field Name: ${customField.name}</h4>`;
                customFieldsElement.innerHTML += `<p>Custom Field ID: ${customField.id}</p>`;
                customFieldsElement.innerHTML += `<p>Custom Field Type: ${customField.type}</p>`;
                customFieldsElement.innerHTML += `<p>Custom Field Position: ${customField.position}</p>`;
            });
        })
        .catch(error => {
            console.error('Error fetching Custom Fields:', error);
        });
    }
});


    // Configuración del botón de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.clear();
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userId');
            window.location.href = '../index.html'; // Nota el cambio aquí
        });
    }
});





