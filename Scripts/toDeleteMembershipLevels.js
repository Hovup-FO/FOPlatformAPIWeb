document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const membershipSelect = document.getElementById('membershipSelect2');
    const membershipLevelsContainer = document.getElementById('membershipLevelSelect2');

    if (!userId || !accessToken) {
        console.error('No userId or accessToken found');
        return;
    }

    function loadSegments() {
        fetch(`https://sandbox-api.foplatform.com/segment/list/${userId}`, {
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

            // Automatically load memberships for the first segment
            if (segments.length > 0) {
                loadMemberships(segments[0].id);
            }
        })
        .catch(error => console.error('Error loading segments:', error));
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
            membershipSelect.innerHTML = '';
            memberships.forEach(membership => {
                const option = document.createElement('option');
                option.value = membership.id;
                option.textContent = membership.name;
                membershipSelect.appendChild(option);
            });

            // Automatically load levels for the first membership
            if (memberships.length > 0) {
                loadMembershipLevels(memberships[0].id);
            }
        })
        .catch(error => console.error('Error loading memberships:', error));
    }

    function loadMembershipLevels(membershipId) {
        if (!membershipId) {
            console.warn('No membershipId provided');
            return;
        }
    
        fetch(`https://sandbox-api.foplatform.com/membership-level/list/${membershipId}?page=1&no_items=10`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
    
    // Asegúrate de que este evento se dispara correctamente
    membershipSelect.addEventListener('change', function() {
        const selectedMembershipId = membershipSelect.value;
        loadMembershipLevels(selectedMembershipId);
    });
    
    

    segmentSelect.addEventListener('change', () => {
        loadMemberships(segmentSelect.value);
    });

    loadSegments();
});