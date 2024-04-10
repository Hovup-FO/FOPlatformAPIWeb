document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');  // Asegúrate de que el token de acceso está correctamente obtenido y almacenado
    const userId = localStorage.getItem('userId');  // Asegúrate de que el userId está correctamente obtenido y almacenado
    const segmentSelect = document.getElementById('segmentSelect');
    const membershipsContainer = document.getElementById('memberships');
   

    if (!userId || !accessToken) {
        console.error('No userId or accessToken found');
        return;  // Detener la ejecución si no se encuentra userId o accessToken
    }

    // Cargar los segmentos inicialmente
      loadSegments();
      
    // Función para cargar y mostrar los segmentos
    function loadSegments() {
        fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}?page=1&no_items=10&removed=false`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(segments => {
            segmentSelect.innerHTML = '';  // Limpiar el select antes de añadir nuevos segmentos
    
            // Agrega una opción inicial al selector como placeholder
            const initialOption = document.createElement('option');
            initialOption.textContent = 'Select a Segment';
            initialOption.value = '';
            initialOption.disabled = true;
            initialOption.selected = true;
            segmentSelect.appendChild(initialOption);
    
            segments.forEach(segment => {
                const option = document.createElement('option');
                option.value = segment.id;
                option.textContent = segment.name;
                segmentSelect.appendChild(option);
            });
            
            segmentSelect.dispatchEvent(new Event('change'));
            // Agrega esta línea si quieres disparar el evento change automáticamente para el primer segmento
            // segmentSelect.dispatchEvent(new Event('change'));
        })
        .catch(error => console.error('Error loading segments:', error));
    }
    
});
