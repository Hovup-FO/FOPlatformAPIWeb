document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');  // Asegúrate de que el token de acceso está correctamente obtenido y almacenado
    const userId = localStorage.getItem('userId');  // Asegúrate de que el userId está correctamente obtenido y almacenado
    const segmentSelect = document.getElementById('segmentSelect');
    const membershipsContainer = document.getElementById('memberships');

    if (!userId || !accessToken) {
        console.error('No userId or accessToken found');
        return;  // Detener la ejecución si no se encuentra userId o accessToken
    }

    // Función para cargar y mostrar los segmentos
    function loadSegments() {
        fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(segments => {
            segmentSelect.innerHTML = '';  // Limpiar el select antes de añadir nuevos segmentos
            segments.forEach(segment => {
                const option = document.createElement('option');
                option.value = segment.id;
                option.textContent = segment.name;
                segmentSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading segments:', error));
    }

    // Función para cargar y mostrar las membresías de un segmento específico
    function loadMemberships(segmentId) {
        membershipsContainer.innerHTML = '';  // Limpiar contenedor antes de añadir nuevos datos

        fetch(`https://sandbox-api.foplatform.com/membership/list/${segmentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(memberships => {
            if (memberships && memberships.length > 0) {
                memberships.forEach(membership => {
                    const membershipDiv = document.createElement('div');
                    membershipDiv.textContent = `Membership Name: ${membership.name}`;
                    membershipDiv.textContent = `Membership ID: ${membership.id}`;
                    membershipsContainer.appendChild(membershipDiv);

                    // Aquí podría ir una llamada adicional para cargar y mostrar los niveles de esta membresía
                });
            } else {
                membershipsContainer.innerHTML = '<p>No memberships found for this segment.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading memberships:', error);
        });
    }

    // Manejador de eventos para cuando se selecciona un nuevo segmento
    segmentSelect.addEventListener('change', () => {
        const selectedSegmentId = segmentSelect.value;
        loadMemberships(selectedSegmentId);
    });

    // Cargar los segmentos inicialmente
    loadSegments();
});
