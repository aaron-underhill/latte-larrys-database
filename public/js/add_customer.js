// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let addCustomerForm = document.getElementById('add-customer-form-ajax');

// Modify the objects we need
addCustomerForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputName = document.getElementById("input-name");
    let inputPhoneNum = document.getElementById("input-phoneNum");
    let inputEmail = document.getElementById("input-email");

    // Get their current values
    let nameValue = inputName.value;
    let phoneNumValue = inputPhoneNum.value;
    let emailValue = inputEmail.value;

    // Build the object we want to send
    let data = {
        name: nameValue,
        phoneNum: phoneNumValue,
        email: emailValue
    };

    // Create an XMLHttpRequest object
    let xhttp = new XMLHttpRequest();

    // Configure the request
    xhttp.open("POST", "/add-customer-ajax", true);

    // Tell the server we're sending JSON
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 201) {

            // This Customer came back from MariaDB
            let newCustomer = JSON.parse(xhttp.responseText);

            // Add the new data to the table
            addRowToTable(newCustomer);

            // Clear the input fields
            inputName.value = '';
            inputPhoneNum.value = '';
            inputEmail.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 201) {
            console.log("There was an error creating the customer.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Creates a single table row from an object representing one Customer
function addRowToTable(newCustomer) {

    // Get the <tbody> belonging to our customer table
    let tableBody = document.querySelector("#customers-table tbody");

    // Create a row and its cells
    let row = document.createElement("TR");
    let idCustomerCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let phoneNumCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Create a button that will go inside the Delete cell
    let deleteButton = document.createElement("button");

    // Fill the cells with the data returned by the server
    idCustomerCell.innerText = newCustomer.idCustomer;
    nameCell.innerText = newCustomer.name;
    phoneNumCell.innerText = newCustomer.phoneNum ?? '';
    emailCell.innerText = newCustomer.email ?? '';

    // Configure the Delete button
    deleteButton.innerText = "Delete";

    deleteButton.onclick = function () {
        deleteCustomer(newCustomer.idCustomer);
    };

    // Put the button inside the table cell
    deleteCell.appendChild(deleteButton);

    // Put all of the cells inside the new row
    row.appendChild(idCustomerCell);
    row.appendChild(nameCell);
    row.appendChild(phoneNumCell);
    row.appendChild(emailCell);
    row.appendChild(deleteCell);

    // Store the customer's ID on the row
    row.setAttribute("data-value", newCustomer.idCustomer);

    // Put the completed row into the table body
    tableBody.appendChild(row);

    // Also add the Customer to the Update dropdown
    let selectMenu = document.getElementById("customer-select");

    if (selectMenu) {

        let option = document.createElement("option");

        option.text =
            `${newCustomer.name} (ID ${newCustomer.idCustomer})`;

        option.value = newCustomer.idCustomer;

        selectMenu.add(option);
    }
}