document.addEventListener('DOMContentLoaded', function() {
    // Elimina cualquier llamada directa a loadMemberships aquí
    // Por ejemplo, quita algo como loadMemberships('membershipSelect1');

    document.getElementById('deleteMembershipButton').addEventListener('click', function() {
        const selectedMembershipId = document.getElementById('membershipSelect1').value;
        deleteMembership(selectedMembershipId);
    });
});

function deleteMembership(membershipId) {
    const accessToken = localStorage.getItem('accessToken');

    if (!membershipId) {
        alert('Please select a membership to delete.');
        return;
    }

    fetch(`https://sandbox-api.foplatform.com/membership/${membershipId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Membership deleted successfully');
            window.location.href = '/../Pages/controlPanel.html'; // Asegúrate de que esta ruta sea correcta
        } else {
            alert('Error deleting membership');
            console.error('Failed to delete the membership:', response);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error deleting membership');
    });
}





