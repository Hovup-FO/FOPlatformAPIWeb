document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const membershipSelect = document.getElementById('membershipSelect1');

    if (!accessToken) {
        console.error('No accessToken found');
        return;
    }

    // Función para cargar las membresías basadas en el segmento seleccionado
    function loadMemberships(segmentId) {
        if (!segmentId) {
            console.error('No segmentId provided');
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
            membershipSelect.innerHTML = '';
            memberships.forEach(membership => {
                const option = document.createElement('option');
                option.value = membership.id;
                option.textContent = membership.name;
                membershipSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading memberships:', error));
    }

    // Obtener segmentSelect del documento o pasar el segmentId de alguna otra manera
    const segmentSelect = document.getElementById('segmentSelect1');
    segmentSelect.addEventListener('change', () => {
        loadMemberships(segmentSelect.value);
    });
});
