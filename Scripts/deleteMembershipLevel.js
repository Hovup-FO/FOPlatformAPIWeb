document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const segmentSelect = document.getElementById('segmentSelect2');
    const membershipSelect = document.getElementById('membershipSelect2');
    const membershipLevelSelect = document.getElementById('membershipLevelSelect2');

    if (!accessToken || !userId) {
        console.error('No accessToken or userId found');
        return;
    }

    segmentSelect.addEventListener('change', function() {
        loadMemberships(this.value);
    });

    membershipSelect.addEventListener('change', function() {
        loadMembershipLevels(this.value);
    });

    document.getElementById('deleteMembershipLevelButton').addEventListener('click', function() {
        const selectedLevelId = membershipLevelSelect.value;
        if (!selectedLevelId) {
            alert('Please select a membership level to delete.');
            return;
        }

        deleteMembershipLevel(selectedLevelId);
    });

    // Llama a loadSegments para cargar inicialmente los segmentos
    loadSegments();

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

    function loadMembershipLevels(membershipId) {
        if (!membershipId) {
            membershipLevelSelect.innerHTML = '<option value="">Select a Membership Level</option>';
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
            membershipLevelSelect.innerHTML = '<option value="">Select a Membership Level</option>';
            levels.forEach(level => {
                const option = document.createElement('option');
                option.value = level.id;
                option.textContent = level.name;
                membershipLevelSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching membership levels:', error);
        });
    }


    function deleteMembershipLevel(levelId) {
        fetch(`https://sandbox-api.foplatform.com/membership-level/${levelId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Membership level deleted successfully');
    
                // Redirigir al control panel después de la eliminación exitosa
                window.location.href = '../Pages/controlPanel.html'; // Asegúrate de reemplazar '/path/to/controlPanel.html' con la ruta real al Control Panel en tu aplicación
            } else {
                alert('Error deleting membership level');
                console.error('Failed to delete the membership level:', response);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting membership level');
        });
    }
    
});
