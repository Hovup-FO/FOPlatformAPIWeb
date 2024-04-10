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