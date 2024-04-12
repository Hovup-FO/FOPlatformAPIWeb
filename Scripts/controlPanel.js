document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const userDataElement = document.getElementById('userData');
    const segmentsElement = document.getElementById('segments');
    const segmentSelect = document.getElementById('segmentSelect');
    const membershipSelect = document.getElementById('membershipSelect');
    const membershipsContainer = document.getElementById('memberships');
    const membershipLevelsContainer = document.getElementById('membershipLevels');
   

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


loadSegments();

    segmentSelect.addEventListener('change', function() {
        loadMemberships(this.value);
    });


    function loadSegments() {
        fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}?page=1&no_items=10&removed=false`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(segments => {
            segmentSelect.innerHTML = '<option value="">Select a Segment</option>';
            segments.forEach(segment => {
                const option = document.createElement('option');
                option.value = segment.id;
                option.textContent = segment.name;
                segmentSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching segments:', error);
        });
    }

    function loadMemberships(segmentId) {
        if (!segmentId) {
            membershipSelect.innerHTML = '<option value="">Select a Membership</option>';
            membershipsContainer.innerHTML = '';  // Limpiar el contenedor de membresías también
            return;
        }
    
        fetch(`https://sandbox-api.foplatform.com/membership/list/${segmentId}?page=1&no_items=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(memberships => {
            // Actualizar el select de memberships
            membershipSelect.innerHTML = '<option value="">Select a Membership</option>';
            memberships.forEach(membership => {
                const option = document.createElement('option');
                option.value = membership.id;
                option.textContent = membership.name;
                membershipSelect.appendChild(option);
            });
    
            // Actualizar el contenedor de detalles de memberships
            console.log(memberships); // Para depuración y ver los datos de las membresías
            membershipsContainer.innerHTML = `<h3>Memberships: (${memberships.length})</h3>`;
            memberships.forEach(membership => {
                membershipsContainer.innerHTML += `<h4>Membership Name: ${membership.name}</h4>`;
                membershipsContainer.innerHTML += `<p>Membership ID: ${membership.id}</p>`;
            });
        })
        .catch(error => {
            console.error('Error fetching memberships:', error);
            membershipSelect.innerHTML = '<option value="">Select a Membership</option>';
            membershipsContainer.innerHTML = 'Error loading memberships.';
        });
    }
    



    function loadMembershipLevels(membershipId) {
        if (!membershipId) {
            console.warn('No membershipId provided');
            return;
        }
    
        fetch(`https://sandbox-api.foplatform.com/membership-level/list/${membershipId}?page=1&no_items=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(levels => {
            membershipLevelsContainer.innerHTML = `<h3>Membership Levels: (${levels.length})</h3>`;
            if (levels && levels.length > 0) {
                levels.forEach(level => {
                    membershipLevelsContainer.innerHTML += `<div><h4>Level Name: ${level.name}</h4><p>Level ID: ${level.id}</p></div>`;
                });
            } else {
                membershipLevelsContainer.innerHTML += '<p>No levels found for this membership.</p>';
            }
        })
        .catch(error => console.error('Error loading membership levels:', error));
    }


// Mostrar Custom Fields
membershipSelect.addEventListener('change', function() {
    const membershipId = this.value;
    if (membershipId) {
        fetch(`https://sandbox-api.foplatform.com/membership-custom-field/list/${membershipId}?page=1&no_items=50`, {
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

    

// Mostrar Users
membershipSelect.addEventListener('change', function() {
    const membershipId = this.value;
    if (membershipId) {
        fetch(`https://sandbox-api.foplatform.com/membership-user/list/${membershipId}?page=1&no_items=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch membership users');
            return response.json();
        })
        .then(membershipUsers => {
            const membershipUsersElement = document.getElementById('membershipUsers');
            membershipUsersElement.innerHTML = `<h3>Membership Users: (${membershipUsers.length})</h3>`;
            membershipUsers.forEach(membershipUser => {
                handleUserDetails(membershipUser, membershipUsersElement);
            });
        })
        .catch(error => {
            console.error('Error fetching Membership Users:', error);
            membershipUsersElement.innerHTML += `<p>Error: ${error.message}</p>`;
        });
    }
});

function handleUserDetails(membershipUser, membershipUsersElement) {
    fetch(`https://sandbox-api.foplatform.com/user/${membershipUser.user_id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user details');
        return response.json();
    })
    .then(user => {
        const userContainer = document.createElement('div');
        userContainer.innerHTML = `
            <h4>Membership User Name: ${membershipUser.name}</h4>
            <p>Membership User ID: ${membershipUser.id}</p>
            <p>Original User ID: ${membershipUser.user_id}</p>
            <p>Card Number: ${membershipUser.card_number}</p>
            <p>User Email: ${user.email || "Email not available"}</p>
        `;
        membershipUsersElement.appendChild(userContainer);
    })
    .catch(error => {
        console.error(`Error fetching user details for user ID ${membershipUser.user_id}:`, error);
        const errorElement = document.createElement('p');
        errorElement.textContent = `Error fetching user details: ${error.message}`;
        membershipUsersElement.appendChild(errorElement);
    });
}







  // Asegúrate de que este evento se dispara correctamente
  membershipSelect.addEventListener('change', function() {
    const selectedMembershipId = membershipSelect.value;
    loadMembershipLevels(selectedMembershipId);
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