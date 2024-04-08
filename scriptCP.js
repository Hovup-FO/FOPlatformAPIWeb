document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('The passwords doesn´t match.');
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
            // Aquí deberás agregar la cabecera de autorización si es necesaria
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User created:', data);
        return validateUser(data.id);
    })
    .then(data => {
        alert('The User has been created and validated succesfully.');
        downloadUserInfo(data.userId, data.accessToken);
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
            // Aquí deberás agregar la cabecera de autorización si es necesaria
        },
        body: JSON.stringify(validationData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('User validated:', data);
        return { userId, accessToken: data.access_token };
    });
}

function downloadUserInfo(userId, accessToken) {
    const element = document.createElement('a');
    const fileContent = `User ID: ${userId}\nAccess Token: ${accessToken}`;
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "FOCredentials.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

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


