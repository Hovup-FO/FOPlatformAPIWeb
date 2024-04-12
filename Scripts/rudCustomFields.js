document.addEventListener('DOMContentLoaded', function() {
    const accessToken = localStorage.getItem('accessToken');    
    const userId = localStorage.getItem('userId');
    const segmentSelect = document.getElementById('segmentSelect4');
    const membershipSelect = document.getElementById('membershipSelect4');
    const customFieldSelect = document.getElementById('customFieldSelect4'); // Selector de Custom Fields
    const editContainer = document.getElementById('customFieldEditContainer');
    const editButton = document.getElementById('editCustomFieldButton');
    const deleteButton = document.getElementById('deleteCustomFieldButton');


    if (!accessToken || !userId) {
        console.error('No accessToken or userId found');
        return;
    }

    loadSegments();

    segmentSelect.addEventListener('change', function() {
        loadMemberships(this.value);
    });

    membershipSelect.addEventListener('change', function() {
        loadCustomFields(this.value);
    });

    customFieldSelect.addEventListener('change', function() {
        const customFieldId = this.value;
        if (!customFieldId) {
            editContainer.innerHTML = '';
            return;
        }
        fetchCustomFieldDetails(customFieldId);
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
            console.log("Received Memberships Data:", memberships);  // Agrega esta línea para ver los datos en la consola
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
    

    function loadCustomFields(membershipId) {
        if (!membershipId) {
            customFieldSelect.innerHTML = '<option value="">Select a Custom Field</option>';
            return;
        }

        fetch(`https://sandbox-api.foplatform.com/membership-custom-field/list/${membershipId}?page=1&no_items=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(customFields => {
            customFieldSelect.innerHTML = '<option value="">Select a Custom Field</option>';
            customFields.forEach(customField => {
                const option = document.createElement('option');
                option.value = customField.id;
                option.textContent = customField.name;
                customFieldSelect.appendChild(option); // Cambio aquí para agregar al selector de Custom Fields
            });
        })
        .catch(error => {
            console.error('Error fetching custom fields:', error);
        });
    }

    function fetchCustomFieldDetails(customFieldId) {
        fetch(`https://sandbox-api.foplatform.com/membership-custom-field/${customFieldId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'accept': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log("Custom Field Data:", data);  // Log para ver los datos recibidos
            populateCustomFieldEditForm(data);
        })
        .catch(error => {
            console.error('Error fetching custom field details:', error);
        });
    }

    function populateCustomFieldEditForm(data) {
        editContainer.innerHTML = '';
        const nameInput = createInputField('Name', 'name', data.name);
        const typeSelect = createSelectField('Type', 'type', data.type, ['dropdown', 'multiple', 'number', 'string', 'url', 'curp', 'text', 'rfc', 'email', 'clabe', 'boolean']);
        const positionInput = createInputField('Position', 'position', data.position, 'number');
        const tagLevelInput = createInputField('Tag Level', 'tag_level', data.tag_level);
        const statusCheckbox = createCheckbox('Status', 'status', data.status);
        const requiredCheckbox = createCheckbox('Required', 'required', data.required);
        const renderCheckbox = createCheckbox('Render', 'render', data.render);
       
        const optionsContainer = document.createElement('div');
        optionsContainer.id = 'optionsContainer';

        const tooltipInput = createInputField('Tooltip', 'tooltip', data.tooltip, 'textarea');
        
        typeSelect.querySelector('select').addEventListener('change', function() {
            updateOptionsInput(this.value, data.options, optionsContainer);
        });
    
        editContainer.appendChild(nameInput);
        editContainer.appendChild(typeSelect);
        editContainer.appendChild(positionInput);
        editContainer.appendChild(tagLevelInput);
        editContainer.appendChild(statusCheckbox);
        editContainer.appendChild(requiredCheckbox);
        editContainer.appendChild(renderCheckbox);
        editContainer.appendChild(tooltipInput);  
        editContainer.appendChild(optionsContainer);
    
        // Disparar el evento de cambio manualmente para configurar el estado inicial correctamente
        typeSelect.querySelector('select').dispatchEvent(new Event('change'));
    }
    
    function updateOptionsInput(type, options, container) {
        if (type === 'dropdown' || type === 'multiple') {
            let optionsText = '';
    
            // Asegurar la creación del label para Options
            const label = document.createElement('label');
            label.textContent = 'Options';
            label.htmlFor = 'options-textarea';  // Asocia el label con el textarea
    
            // Creación del textarea para las opciones
            const textarea = document.createElement('textarea');
            textarea.id = 'options-textarea';
            textarea.name = 'options';
            textarea.placeholder = "Enter options as key:value pairs separated by commas. For example, key1:value1, key2:value2";
            
            try {
                if (typeof options === 'string') {
                    options = JSON.parse(options);
                }
                if (Array.isArray(options)) {
                    optionsText = options.map(option => `${option.key}:${option.value}`).join(', ');
                }
                textarea.value = optionsText;  // Usar value para establecer el contenido del textarea
            } catch (e) {
                console.error('Error parsing options:', e);
            }
    
            container.innerHTML = ''; // Limpia el contenedor antes de agregar nuevos elementos
            container.appendChild(label);
            container.appendChild(textarea);  // Añadir textarea al contenedor
        } else {
            container.innerHTML = '';
        }
    }
    
    
    
        
    
    editButton.addEventListener('click', function(event) {
        event.preventDefault();
        const customFieldId = customFieldSelect.value;
        if (customFieldId) {
            editCustomField(customFieldId);
        }
    });

    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();
        const customFieldId = customFieldSelect.value;
        if (customFieldId) {
            deleteCustomField(customFieldId);
        }
    });
    
function createSelectField(labelText, name, selectedValue, options) {
    const label = document.createElement('label');
    label.textContent = labelText;

    const select = document.createElement('select');
    select.name = name;

    options.forEach(optionValue => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        if (optionValue === selectedValue) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    label.appendChild(select);
    return label;
}


function createInputField(labelText, name, value, type = 'text') {
    const label = document.createElement('label');
    label.textContent = labelText;

    let input;
    if (type === 'textarea') {
        input = document.createElement('textarea');
        input.name = name;
        input.rows = 4;  // Puedes ajustar el número de filas según tus necesidades
        input.cols = 25; // Puedes ajustar el número de columnas según tus necesidades
        input.textContent = value; // Usar textContent para textarea
    } else {
        input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.value = value;
    }

    label.appendChild(input);
    return label;
}

function createOptionsField() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('input-group'); // Uso consistente de clases para alineación

    const label = document.createElement('label');
    label.textContent = 'Options';
    label.htmlFor = 'options';  // Asegúrate de que el ID coincida

    const textarea = document.createElement('textarea');
    textarea.name = 'options';
    textarea.id = 'options'; // ID usado en el htmlFor del label
    textarea.placeholder = "Enter options as key:value pairs separated by commas. For example, key1:value1, key2:value2";
    textarea.rows = 4;
    textarea.cols = 50;

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
    return wrapper;
}


    function createCheckbox(labelText, name, checked) {
        const label = document.createElement('label');
        label.textContent = labelText;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = name;
        checkbox.checked = checked;

        label.appendChild(checkbox);
        return label;
    }

    function editCustomField(customFieldId) {
        const name = document.querySelector('[name="name"]').value;
        const type = document.querySelector('[name="type"]').value;
        const position = parseInt(document.querySelector('[name="position"]').value, 10);
        const tagLevel = document.querySelector('[name="tag_level"]').value;
        const status = document.querySelector('[name="status"]').checked;
        const required = document.querySelector('[name="required"]').checked;
        const render = document.querySelector('[name="render"]').checked;
        let options = [];
    
        if (type === 'dropdown' || type === 'multiple') {
            const optionsText = document.querySelector('[name="options"]').value;
            if (optionsText) {
                options = optionsText.split(',').map(optionPair => {
                    const [key, value] = optionPair.split(':').map(part => part.trim());
                    return { key, value };
                });
            }
        }
    
        const data = {
            name,
            type,
            position,
            tag_level: tagLevel,
            status,
            required,
            render,
            options
        };
    
        fetch(`https://sandbox-api.foplatform.com/membership-custom-field/${customFieldId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error editing custom field: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Custom field edited successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error editing custom field');
        });
    }
    
    
    
    
    function deleteCustomField(customFieldId) {
        fetch(`https://sandbox-api.foplatform.com/membership-custom-field/${customFieldId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting custom field');
            }
            alert('Custom field deleted successfully');
            // Redirige al control panel después de una eliminación exitosa
            window.location.href = '../Pages/controlPanel.html'; 
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting custom field');
        });
    }


});