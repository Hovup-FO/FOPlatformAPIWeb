document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const nameField = document.getElementById('name');
    const mobileField = document.getElementById('mobile');
    const langField = document.getElementById('lang');

    const email = emailField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    if (password !== confirmPassword) {
        alert('The passwords don’t match.');
        return;
    }

    checkUserAvailability(email)
        .then(isAvailable => {
            if (!isAvailable) {
                alert('Your email already exists in our database');
                clearFormFields();
                return null;
            }

            const userData = {
                email: email,
                name: nameField.value,
                mobile: mobileField.value,
                password: password,
                lang: langField.value
            };

            return createUser(userData);
        })
        .then(data => {
            if (data) {
                console.log('User created:', data);
                return validateUser(data.id);
            }
        })
        .then(data => {
            if (data) {
                console.log('The User has been created and validated successfully.');
                localStorage.setItem('userId', data.userId);
                window.location.href = '/Pages/login.html?success=true';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error creating user');
        });

    function clearFormFields() {
        emailField.value = '';
        passwordField.value = '';
        confirmPasswordField.value = '';
        nameField.value = '';
        mobileField.value = '';
        langField.value = '';
    }
});

function checkUserAvailability(email) {
    return fetch(`https://sandbox-api.foplatform.com/user/available?key=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            return false; // Email already exists
        }
        if (response.status === 404) {
            return true; // Email is available
        }
        throw new Error('Error checking user availability');
    });
}

function createUser(userData) {
    return fetch('https://sandbox-api.foplatform.com/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json());
}

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

// Funcionalidad para mostrar/ocultar contraseña
const showPasswordCheckbox = document.getElementById('showPassword');
if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', function() {
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
