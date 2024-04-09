// callSegments.js
document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');  // Asumiendo que el ID necesario es el userId
    const segmentSelect = document.getElementById('segmentSelect');

    if (!accessToken || !userId) {
        console.error('No accessToken or userId found');
        return;
    }

    fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}?page=1&no_items=10&removed=true`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(segments => {
        segmentSelect.innerHTML = '';
        segments.forEach(segment => {
            const option = document.createElement('option');
            option.value = segment.id;
            option.textContent = segment.name;
            segmentSelect.appendChild(option);
        });

        // Disparar el evento change manualmente para cargar las membresías del primer segmento
        if (segments.length > 0) {
            segmentSelect.value = segments[0].id; // Selecciona el primer segmento
            segmentSelect.dispatchEvent(new Event('change'));
        }
    })
    .catch(error => {
        console.error('Error fetching segments:', error);
    });

    segmentSelect.addEventListener('change', function() {
        const selectedSegmentId = segmentSelect.value;
        loadMemberships('membershipSelect', selectedSegmentId);
    });
});



