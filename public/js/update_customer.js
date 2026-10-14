// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let updateCustomerForm =
    document.getElementById('update-customer-form-ajax');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputID =
        document.getElementById("customer-select");

    let inputName =
        document.getElementById("input-name-update");

    let inputPhoneNum =
        document.getElementById("input-phoneNum-update");

    let inputEmail =
        document.getElementById("input-email-update");

    // Get their current values
    let idValue = inputID.value;
    let nameValue = inputName.value;
    let phoneNumValue = inputPhoneNum.value;
    let emailValue = inputEmail.value;

    // Build the object we want to send
    let data = {
        id: idValue,
        name: nameValue,
        phoneNum: phoneNumValue,
        email: emailValue
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();

    xhttp.open("PUT", "/put-customer-ajax", true);

    xhttp.setRequestHeader(
        "Content-type",
        "application/json"
    );

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Parse the actual updated Customer
            // that the server SELECTed back from MariaDB
            let updatedCustomer =
                JSON.parse(xhttp.responseText);

            // Update the HTML table
            updateRow(updatedCustomer);

            // Update the Customer name in the dropdown
            updateCustomerDropdown(updatedCustomer);

            // Clear the update fields
            inputName.value = '';
            inputPhoneNum.value = '';
            inputEmail.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error updating the customer.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Update the Customer's existing row in the HTML table
function updateRow(updatedCustomer) {

    // Find the table row belonging to this Customer
    let row = document.querySelector(
        `#customers-table tbody tr[data-value="${updatedCustomer.idCustomer}"]`
    );

    if (!row) {
        return;
    }

    // Get all the <td> cells from the row
    let cells = row.getElementsByTagName("td");

    /*
        Customer table layout:

        cells[0] = idCustomer
        cells[1] = name
        cells[2] = phoneNum
        cells[3] = email
        cells[4] = Delete button
    */

    cells[0].innerText = updatedCustomer.idCustomer;
    cells[1].innerText = updatedCustomer.name;
    cells[2].innerText = updatedCustomer.phoneNum ?? '';
    cells[3].innerText = updatedCustomer.email ?? '';
}


// Update the Customer's displayed name in the dropdown
function updateCustomerDropdown(updatedCustomer) {

    let selectMenu =
        document.getElementById("customer-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${updatedCustomer.idCustomer}"]`
    );

    if (option) {
        option.text =
            `${updatedCustomer.name} (ID ${updatedCustomer.idCustomer})`;
    }
}