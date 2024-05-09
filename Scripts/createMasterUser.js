document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const nameField = document.getElementById('name');
    const mobileField = document.getElementById('mobile');
    const langField = document.getElementById('lang');

    // Obtiene la instancia de intlTelInput
    const iti = window.intlTelInputGlobals.getInstance(mobileField);
    const mobileFull = iti.getNumber(); // Obtiene número completo con código de país

    const email = emailField.value;
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;
    const name = nameField.value;
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
                    mobile: mobileFull, // Usa el número completo aquí
                    password: password,
                    lang: lang
                });
            }
        })
        .then(user => {
            if (user) {
                return validateUser(user.id, mobileFull); // Usa el número completo aquí
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

// Este script se debe colocar en un archivo .js y enlazarlo desde la página HTML

document.addEventListener('DOMContentLoaded', function() {
    // Función para obtener parámetros de la URL
    function getQueryParam(param) {
        var queryParams = new URLSearchParams(window.location.search);
        return queryParams.get(param);
    }

    // Obtener el email de la URL
    var email = getQueryParam('email');
    
    // Si hay un email, establecerlo como valor del campo de email en el formulario
    if (email) {
        var emailField = document.getElementById('email');
        if (emailField) {
            emailField.value = email;
        }
    }
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
