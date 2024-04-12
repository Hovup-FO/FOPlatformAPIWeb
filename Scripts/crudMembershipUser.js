document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');    
    const userId = localStorage.getItem('userId');
    const segmentSelect = document.getElementById('segmentSelect5');
    const membershipSelect = document.getElementById('membershipSelect5');
    const searchInput = document.querySelector('[name="search-text"]');
    const searchButton = document.querySelector('button[type="submit"]');
    const editContainer = document.getElementById('membershipUserEditContainer');



    if (!accessToken || !userId) {
        console.error('No accessToken or userId found');
        return;
    }

    loadSegments();

    segmentSelect.addEventListener('change', function() {
        loadMemberships(this.value);
        loadMembershipUsers(this.value);  // Cargar usuarios de la membresía seleccionada
    });

    membershipSelect.addEventListener('change', function() {
        loadMembershipUsers(this.value);  // Cargar usuarios de la membresía seleccionada
    });

    searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        const membershipId = searchInput.value.trim();
        if (membershipId) {
            fetchMembershipUserDetails(membershipId);
        } else {
            console.log("Please enter a valid membership ID.");
            editContainer.innerHTML = 'Please enter a valid membership ID.';
        }
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
        fetch(`https://sandbox-api.foplatform.com/membership/list/${segmentId}?page=1&no_items=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(memberships => {
            membershipSelect.innerHTML = '<option value="">Select a Membership</option>';
            memberships.forEach(membership => {
                const option = document.createElement('option');
                option.value = membership.id;
                option.textContent = membership.name;
                membershipSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching memberships:', error);
        });
    }

    function loadMembershipUsers(membershipId) {
        fetch(`https://sandbox-api.foplatform.com/membership-user/list/${membershipId}?page=1&no_items=500`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(users => {
            console.log('Loaded users:', users);  // Agregar manejo de visualización de usuarios aquí si es necesario
        })
        .catch(error => {
            console.error('Error fetching membership users:', error);
        });
    }

    function fetchMembershipUserDetails(membershipId) {
        fetch(`https://sandbox-api.foplatform.com/membership-user/${membershipId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(userDetails => {
            editContainer.innerHTML = '';  // Limpiar el contenedor antes de agregar nuevos detalles
            Object.keys(userDetails).forEach(key => {
                const valueElement = document.createElement('p');
                valueElement.textContent = `${key}: ${userDetails[key]}`;
                editContainer.appendChild(valueElement);
            });
        })
        .catch(error => {
            console.error('Error fetching membership user details:', error);
            editContainer.innerHTML = `Error: ${error.message}`;
        });
    }




    
    
});