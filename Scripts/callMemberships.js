// callMemberships.js
function loadMemberships(selectorId, segmentId) {
    const accessToken = localStorage.getItem('accessToken');
    const membershipSelect = document.getElementById(selectorId);

    if (!accessToken || !segmentId) {
        console.error('No accessToken or segmentId found');
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
    .catch(error => {
        console.error('Error fetching memberships:', error);
    });
}

// Esta función debería ser llamada cuando se cambie el selector de segmento en callSegments.js




