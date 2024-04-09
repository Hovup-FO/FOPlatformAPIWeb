document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const segmentSelect = document.getElementById('segmentSelect');
    const addLevelButton = document.getElementById('addLevelButton');
    const membershipForm = document.getElementById('membershipForm');
    const membershipLevelsContainer = document.getElementById('membershipLevelsContainer');
    let levelCounter = 1; // Contador para el número de nivel

    // Cargar segmentos
    fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}?page=1&no_items=10&removed=false`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(segments => {
        segments.forEach(segment => {
            const option = document.createElement('option');
            option.value = segment.id;
            option.textContent = segment.name;
            segmentSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching segments:', error));

// Función para agregar campos de nivel de membresía
addLevelButton.addEventListener('click', () => {
    const levelDiv = document.createElement('div');
    levelDiv.className = 'level';
    levelDiv.innerHTML = `
        <input type="text" placeholder="Level Name" class="level-name" required>
        <input type="number" placeholder="From Point" class="from-point" required>
        <input type="number" placeholder="To Point" class="to-point" required>
        <span>Number Level: ${levelCounter}</span>
    `;
    membershipLevelsContainer.appendChild(levelDiv);
    levelCounter++; // Incrementar el contador para el siguiente nivel
});


// Manejar la creación de la membresía y sus niveles
membershipForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const membershipName = document.getElementById('membershipName').value;
    const segmentId = segmentSelect.value;

    // Crear la membresía
    fetch(`https://sandbox-api.foplatform.com/membership`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ segment_id: segmentId, name: membershipName })
    })
    .then(response => response.json())
    .then(membership => {
        const levelElements = membershipLevelsContainer.querySelectorAll('.level');
        const levelPromises = Array.from(levelElements).map((levelDiv) => {
            // Aquí se usan las líneas para seleccionar los elementos dentro de cada 'levelDiv'
            const nameInput = levelDiv.querySelector('.level-name');
            const fromPointInput = levelDiv.querySelector('.from-point');
            const toPointInput = levelDiv.querySelector('.to-point');

            if (!nameInput || !fromPointInput || !toPointInput) {
                console.error('One or more input elements are missing.');
                return Promise.reject(new Error('Input element not found'));
            }

            const name = nameInput.value;
            const fromPoint = parseInt(fromPointInput.value, 10);
            const toPoint = parseInt(toPointInput.value, 10);

            return fetch(`https://sandbox-api.foplatform.com/membership-level`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    membership_id: membership.id,
                    name,
                    from_point: fromPoint,
                    to_point: toPoint,
                    image: "https://example.com/image.png",
                    type_image: "png",
                    background_color: "any",
                    text_color: "any",
                    status: true,
                    number_level: levelCounter++
                })
            }).then(response => response.json());
        });

        Promise.all(levelPromises)
            .then(() => {
                alert('Membership and all levels created successfully');
                window.location.href = 'controlPanel.html';
            })
            .catch(error => {
                console.error('Error creating levels:', error);
                alert('Error creating levels');
            });
    })
    .catch(error => {
        console.error('Error creating membership:', error);
        alert('Error creating membership');
    });
});

});
