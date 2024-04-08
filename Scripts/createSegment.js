document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('userId'); // Asumiendo que el userID se almacena previamente
    document.getElementById('userId').value = userId;
    document.getElementById('managedBy').value = userId;

    document.getElementById('segmentForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const segmentData = {
            name: document.getElementById('segmentName').value,
            owner_id: userId,
            managed_by: userId,
            status: true,
            role: 'supervisor'
        };

        fetch('https://sandbox-api.foplatform.com/segment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(segmentData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Segment created:', data);
            alert('Segment created successfully');
            window.location.href = '/Pages/controlPanel.html'; // Redirige al usuario
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error creating segment');
        });
    });
});
