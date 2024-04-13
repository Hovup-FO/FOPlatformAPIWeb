function refreshToken(refreshToken) {
    const url = 'https://sandbox-api.foplatform.com/login/refresh';
    const body = {
        refresh_token: refreshToken
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            // Aquí se supone que usas localStorage para guardar el token
            localStorage.setItem('accessToken', data.access_token);
            console.log('Token refreshed successfully');
            // También puedes actualizar el refresh token si se retorna uno nuevo
            if (data.refresh_token) {
                localStorage.setItem('refreshToken', data.refresh_token);
            }
        } else {
            console.error('Failed to refresh token, server did not return an access token.');
        }
    })
    .catch(error => {
        console.error('Error refreshing token:', error);
    });
}
