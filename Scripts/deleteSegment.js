document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const segmentSelect = document.getElementById('segmentSelect');

    // Cargar los segmentos en el select
    fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,

        }
    })
    .then(response => response.json())
    .then(segments => {
        segments.forEach(segment => {
            const option = document.createElement('option');
            option.value = segment.id;  // El valor de la opción es el UUID del segmento
            option.textContent = segment.name;  // El texto mostrado es el nombre del segmento
            segmentSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching segments:', error);
    });

    // Manejar la eliminación del segmento
    document.getElementById('deleteSegmentButton').addEventListener('click', function() {
        const selectedSegmentId = segmentSelect.value;
        if (!selectedSegmentId) {
            alert('Please select a segment to delete.');
            return;
        }

        fetch(`https://sandbox-api.foplatform.com/segment/${selectedSegmentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Segment deleted successfully');
                window.location.href = '/Pages/controlPanel.html'; // Redirige al controlPanel.html
            } else {
                alert('Error deleting segment');
                console.error('Failed to delete the segment:', response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting segment');
        });
    });
});


