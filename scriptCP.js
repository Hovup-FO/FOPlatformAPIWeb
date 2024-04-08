document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('The passwords don´t match.');
        return;
    }

    const userData = {
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        mobile: document.getElementById('mobile').value,
        password: password,
        lang: document.getElementById('lang').value
    };

    fetch('https://sandbox-api.foplatform.com/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User created:', data);
        return validateUser(data.id);
    })
    .then(data => {
        console.log('The User has been created and validated successfully.');
        localStorage.setItem('userId', data.userId); // Guarda el userId en el almacenamiento local
        window.location.href = 'login.html?success=true'; // Redirige al usuario a la página de login con parámetro de éxito
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Creating user error');
    });
});

function validateUser(userId) {
    const validationData = {
        verification_code: "00000",
        user_id: userId
    };

    return fetch('https://sandbox-api.foplatform.com/user/validate-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify(validationData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User validated:', data);
        return { userId: userId, accessToken: data.access_token };
    });
}

if (document.getElementById('showPassword')) {
    document.getElementById('showPassword').addEventListener('change', function(event) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (this.checked) {
            passwordInput.type = 'text';
            confirmPasswordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
            confirmPasswordInput.type = 'password';
        }
    });
}







