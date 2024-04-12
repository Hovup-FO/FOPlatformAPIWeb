document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');    
    const userId = localStorage.getItem('userId');
    const segmentSelect = document.getElementById('segmentSelect3');
    const membershipSelect = document.getElementById('membershipSelect3');

    if (!accessToken || !userId) {
        console.error('No accessToken or userId found');
        return;
    }

    loadSegments();
    createCustomFieldForm();

    segmentSelect.addEventListener('change', function() {
        loadMemberships(this.value);
    });


    document.getElementById('createCustomFieldButton').addEventListener('click', function(event) {
        event.preventDefault(); // Prevenir la recarga de la página por el submit del formulario
        
        const name = document.querySelector('[name="name"]').value;
        const type = document.querySelector('[name="type"]').value;
        const required = document.querySelector('[name="required"]').checked;
        const render = document.querySelector('[name="render"]').checked;
        const position = parseInt(document.querySelector('[name="position"]').value, 10);
        const membershipId = membershipSelect.value;

        let data = {
        membership_id: membershipId,
        name,
        status: true, // O obtener este valor dinámicamente según tu lógica
        type,
        required,
        render,
        position
    };

    // Agrega las opciones si el tipo es 'dropdown' o 'multiple'
    if (data.type === 'dropdown' || data.type === 'multiple') {
        const optionsString = document.querySelector('#optionsContainer textarea').value;
        data.options = optionsString.split(',').map(optionPair => {
            const [key, value] = optionPair.split(':').map(part => part.trim());
            return { key, value };
        });
    }

    createCustomField(data);
    });


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


    function createCustomFieldForm() {
        const customFieldContainer = document.getElementById('customFieldContainer');
        customFieldContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevos campos
    
        // Campo para 'name'
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('name', 'name');
        nameInput.setAttribute('placeholder', 'Field Name');
        customFieldContainer.appendChild(nameInput);
    
     // Selector para 'type'
     const typeSelect = document.createElement('select');
     typeSelect.setAttribute('name', 'type');

      // Añadir una primera opción como placeholder
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select Data Type';
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    typeSelect.appendChild(defaultOption);

     const types = ['dropdown', 'multiple', 'number', 'string','url', 'curp', 'text', 'rfc', 'email', 'clabe', 'boolean'];
     types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeSelect.appendChild(option);
    });
    customFieldContainer.appendChild(typeSelect);

    const optionsContainer = document.createElement('div');
    optionsContainer.id = 'optionsContainer';
    customFieldContainer.appendChild(optionsContainer);

    typeSelect.addEventListener('change', function() {
        if (this.value === 'dropdown' || this.value === 'multiple') {
            optionsContainer.innerHTML = '<textarea name="options" placeholder="Enter options as key:value pairs separated by commas. For example, key1:value1, key2:value2"></textarea>';
        } else {
            optionsContainer.innerHTML = ''; // Clear if not 'dropdown' or 'multiple'
        }
    });

    
       // Checkbox para 'required'
const requiredContainer = document.createElement('div');
requiredContainer.classList.add('checkbox-container');

const requiredCheckbox = document.createElement('input');
requiredCheckbox.setAttribute('type', 'checkbox');
requiredCheckbox.setAttribute('name', 'required');
requiredCheckbox.setAttribute('id', 'required');
requiredContainer.appendChild(requiredCheckbox);

const requiredLabel = document.createElement('label');
requiredLabel.setAttribute('for', 'required');
requiredLabel.textContent = ' Required';
requiredContainer.appendChild(requiredLabel);

customFieldContainer.appendChild(requiredContainer);

// Similar para 'render'
const renderContainer = document.createElement('div');
renderContainer.classList.add('checkbox-container');

const renderCheckbox = document.createElement('input');
renderCheckbox.setAttribute('type', 'checkbox');
renderCheckbox.setAttribute('name', 'render');
renderCheckbox.setAttribute('id', 'render');
renderContainer.appendChild(renderCheckbox);

const renderLabel = document.createElement('label');
renderLabel.setAttribute('for', 'render');
renderLabel.textContent = ' Render';
renderContainer.appendChild(renderLabel);

customFieldContainer.appendChild(renderContainer);

    
        // Campo para 'position'
        const positionInput = document.createElement('input');
        positionInput.setAttribute('type', 'number');
        positionInput.setAttribute('name', 'position');
        positionInput.setAttribute('placeholder', 'Position');
        customFieldContainer.appendChild(positionInput);
    
    
    }
    
    createCustomFieldForm();
  

    document.getElementById('createCustomFieldButton').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir la recarga de la página por el submit del formulario
        
        const name = document.querySelector('[name="name"]').value;
        const type = document.querySelector('[name="type"]').value;
        const required = document.querySelector('[name="required"]').checked;
        const render = document.querySelector('[name="render"]').checked;
        const position = parseInt(document.querySelector('[name="position"]').value, 10);
        const membershipId = membershipSelect.value;
    
        let options = [];
        if (type === 'dropdown' || type === 'multiple') {
            const optionsString = document.querySelector('#optionsContainer textarea').value;
            options = optionsString.split(',').map(optionPair => {
                const [key, value] = optionPair.split(':').map(part => part.trim());
                return { key, value };
            });
        }
    
        let data = {
            membership_id: membershipId,
            name,
            status: true, // O obtener este valor dinámicamente según tu lógica
            type,
            required,
            render,
            position,
            options // Envía directamente el array de objetos
        };
    
        createCustomField(data);
    });
    
    function createCustomField(data) {
        console.log('Sending data to API:', data); // Para depuración
        const accessToken = localStorage.getItem('accessToken');
    
        fetch('https://sandbox-api.foplatform.com/membership-custom-field', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Asegurarte de enviar el body como JSON
        })
        .then(response => {
            console.log('API response:', response); // Para depuración, ve la respuesta completa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            console.log('Success:', json);
            alert('Custom field created successfully');
            window.location.href = 'controlPanel.html'; // Redirigir a otro lugar después del éxito
        })
        .catch(error => {
            console.error('Failed to create the custom field:', error);
            alert('Error creating custom field');
        });
    }
    



});