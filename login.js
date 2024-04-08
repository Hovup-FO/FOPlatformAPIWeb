document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un mensaje de éxito en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');

    if (success) {
        const loginMessageElement = document.getElementById('loginMessage');
        loginMessageElement.textContent = 'Your Master User was created successfully. Please login for the first time.';
        loginMessageElement.style.color = 'white';
        loginMessageElement.style.marginBottom = '15px'; // Ejemplo de estilo
    }

    // Manejo del formulario de inicio de sesión
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageElement = document.getElementById('message');

        fetch('https://sandbox-api.foplatform.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                console.log('Login successful:', data);
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('userId', data.id); // Guarda el userId en el almacenamiento local
                window.location.href = 'controlPanel.html'; // Redirige al usuario al panel de control
            } else {
                messageElement.textContent = 'Login failed: ' + data.message;
                messageElement.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageElement.textContent = 'Error during login';
            messageElement.style.color = 'red';
        });
    });
});
