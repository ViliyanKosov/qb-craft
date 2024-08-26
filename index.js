document.getElementById('createForm').addEventListener('click', handleSubmit);
document.getElementById('clearForm').addEventListener('click', clearForm);
document.addEventListener('DOMContentLoaded', loadFormData);

function handleSubmit() {
    const label = document.getElementById('labelField').value.trim();
    const choices = document.getElementById('choicesField').value.trim().split('\n').map(choice => choice.trim()).filter(choice => choice !== '');
    const defaultValue = document.getElementById('defaultValue').value.trim();
    const isMultichoice = document.getElementById('type').value;
    const order = document.getElementById('order').value;

    // Validation
    let validationMessages = [];
    const uniqueChoices = [...new Set(choices)];

    function validationMessageError(message) {
        document.getElementById('formMessage').style.display = 'none';
        validationMessage = [];
        validationMessages.push(message);
    }

    if (!label) {
        validationMessageError("Label field is required.")
    }
    if (choices.length > 50) {
        validationMessageError("There cannot be more than 50 choices.")
    }
    if (choices.length !== uniqueChoices.length) {
        validationMessageError("Duplicate choices are not allowed.")
    }
    if (choices.some(choice => choice.length > 40)) {
        validationMessageError("Each choice must be 40 characters or fewer.")
    }
    if (defaultValue && !choices.includes(defaultValue)) {
        uniqueChoices.push(defaultValue);
    }
    // Display validation messages
    const validationDiv = document.getElementById('validationMessages');
    validationDiv.innerHTML = validationMessages.join('<br/>');

    if (validationMessages.length > 0) {
        return;
    }

    if (order === 'alphabetical') {
        uniqueChoices.sort((a, b) => a.localeCompare(b));
    }

    // Construct the JSON object to be sent
    const data = {
        label: label,
        choices: uniqueChoices,
        defaultValue: defaultValue,
        multichoice: isMultichoice
    };

    // Log data to console
    console.log("Posting data:", data);

    // Post data to Mocky endpoint
    const mockyURL = "https://run.mocky.io/v3/49c92162-ef24-4576-976b-2d9049c9d7d5";
    fetch(mockyURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        let success = true;
        console.log("Response from Mocky:", data);
        displayFormMessage("Form submitted successfully!", success); // Display success message
    })
    .catch(error => {
        let success = false;
        console.error("Error:", error);
        displayFormMessage("Failed to submit form. Please try again.", success); // Display error message
    });

    // Save form data to local storage for recovery
    saveFormData();
}


function clearForm() {
    document.getElementById('labelField').value = '';
    document.getElementById('choicesField').value = '';
    document.getElementById('defaultValue').value = '';
    document.getElementById('type').value = 'singleSelect';
    document.getElementById('order').value = 'alphabetical';
    document.getElementById('validationMessages').innerHTML = '';
    document.getElementById('formMessage').innerHTML = ''; 
    localStorage.removeItem('formData'); // Clear saved form data from local storage
}

function saveFormData() {
    const formData = {
        label: document.getElementById('labelField').value,
        choices: document.getElementById('choicesField').value,
        defaultValue: document.getElementById('defaultValue').value,
        multichoice: document.getElementById('type').value,
        order: document.getElementById('order').value
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
        document.getElementById('labelField').value = savedData.label;
        document.getElementById('choicesField').value = savedData.choices;
        document.getElementById('defaultValue').value = savedData.defaultValue;
        document.getElementById('type').value = savedData.multichoice;
        document.getElementById('order').value = savedData.order;
    }
}

function displayFormMessage(message, success) {
    const formMessageDiv = document.getElementById('formMessage');
    if (success)  {
        formMessageDiv.classList.toggle("success-message");
    } else {
        formMessageDiv.classList.toggle("error-message");
    }
    formMessageDiv.innerHTML = message;
    formMessageDiv.style.display = 'block';
    // Optionally hide message after a few seconds
    setTimeout(() => {
        formMessageDiv.style.display = 'none';
    }, 5000); // 5 seconds
}