// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form-ajax');

// Modify the objects we need
addEmployeeForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputName = document.getElementById("input-name");
    let inputPassword = document.getElementById("input-password");
    let inputPhoneNum = document.getElementById("input-phoneNum");
    let inputEmail = document.getElementById("input-email");
    let inputAddress = document.getElementById("input-address");

    // Get their current values
    let nameValue = inputName.value;
    let passwordValue = inputPassword.value;
    let phoneNumValue = inputPhoneNum.value;
    let emailValue = inputEmail.value;
    let addressValue = inputAddress.value;

    // Build the object we want to send
    let data = {
        name: nameValue,
        password: passwordValue,
        phoneNum: phoneNumValue,
        email: emailValue,
        address: addressValue
    };

    // Create an XMLHttpRequest object
    let xhttp = new XMLHttpRequest();

    // Configure the request
    xhttp.open("POST", "/add-employee-ajax", true);

    // Tell the server we're sending JSON
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 201) {

            // Parse the actual Employee row
            // that was SELECTed back from MariaDB
            let newEmployee = JSON.parse(xhttp.responseText);

            // Add the new Employee to the HTML table
            addRowToTable(newEmployee);

            // Clear the input fields
            inputName.value = '';
            inputPassword.value = '';
            inputPhoneNum.value = '';
            inputEmail.value = '';
            inputAddress.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 201) {
            console.log("There was an error creating the employee.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Creates a single table row from an object representing one Employee
function addRowToTable(newEmployee) {

    // Get the <tbody> belonging to our Employee table
    let tableBody = document.querySelector("#employees-table tbody");

    // Create a row and its cells
    let row = document.createElement("TR");

    let idEmployeeCell = document.createElement("TD");
    let idPasswordCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let phoneNumCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Create a button that will go inside the Delete cell
    let deleteButton = document.createElement("button");

    // Fill the cells with the data returned by the server
    idEmployeeCell.innerText = newEmployee.idEmployee;
    idPasswordCell.innerText = newEmployee.idPassword;
    nameCell.innerText = newEmployee.name;
    phoneNumCell.innerText = newEmployee.phoneNum;
    emailCell.innerText = newEmployee.email;
    addressCell.innerText = newEmployee.address;

    // Configure the Delete button
    deleteButton.innerText = "Delete";
    deleteButton.type = 'button';

    deleteButton.classList.add(
        'button',
        'button-danger'
    );

    deleteButton.onclick = function () {
        deleteEmployee(newEmployee.idEmployee);
    };

    // Put the button inside the Delete cell
    deleteCell.appendChild(deleteButton);

    // Put all cells inside the row
    row.appendChild(idEmployeeCell);
    row.appendChild(idPasswordCell);
    row.appendChild(nameCell);
    row.appendChild(phoneNumCell);
    row.appendChild(emailCell);
    row.appendChild(addressCell);
    row.appendChild(deleteCell);

    // Store the Employee ID on the row
    row.setAttribute("data-value", newEmployee.idEmployee);

    // Add the completed row to the table body
    tableBody.appendChild(row);

    // Also add the new Employee to the Update dropdown
    // without requiring a page refresh
    let selectMenu = document.getElementById("employee-select");

    if (selectMenu) {

        let option = document.createElement("option");

        option.text =
            `${newEmployee.name} (ID ${newEmployee.idEmployee})`;

        option.value = newEmployee.idEmployee;

        selectMenu.add(option);
    }
}