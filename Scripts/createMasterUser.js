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
    const name = nameField.value;
    const mobile = mobileField.value;
    const lang = langField.value;

    if (password !== confirmPassword) {
        alert('The passwords don’t match.');
        return;
    }

    checkUserAvailability(email)
        .then(userExists => {
            if (userExists) {
                alert('Your email already exists in our database');
                clearFormFields();
                return null;
            } else {
                return createUser({
                    email: email,
                    name: name,
                    mobile: mobile,
                    password: password,
                    lang: lang
                });
            }
        })
        .then(user => {
            if (user) {
                return validateUser(user.id, mobile); // Usar 'id' de la respuesta y 'mobile' del formulario
            }
        })
        .then(validationResponse => {
            if (validationResponse) {
                window.location.href = 'login.html?success=true';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error processing your request');
        });
});

function clearFormFields() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('name').value = '';
    document.getElementById('mobile').value = '';
    document.getElementById('lang').value = '';
}

function checkUserAvailability(email) {
    return fetch(`https://sandbox-api.foplatform.com/user/available?key=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            return true;
        }
        if (response.status === 404) {
            return false;
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create user');
        }
        return response.json();
    });
}

function validateUser(userId, mobile) {
    return fetch('https://sandbox-api.foplatform.com/user/validate-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        },
        body: JSON.stringify({
            verification_code: "00000",
            user_id: userId,
            phone: mobile
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to validate user');
        }
        return response.json();
    });
}

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
