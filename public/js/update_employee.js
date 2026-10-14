// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let updateEmployeeForm =
    document.getElementById('update-employee-form-ajax');

// Modify the objects we need
updateEmployeeForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputID =
        document.getElementById("employee-select");

    let inputName =
        document.getElementById("input-name-update");

    let inputPhoneNum =
        document.getElementById("input-phoneNum-update");

    let inputEmail =
        document.getElementById("input-email-update");

    let inputAddress =
        document.getElementById("input-address-update");

    // Get their current values
    let idValue = inputID.value;
    let nameValue = inputName.value;
    let phoneNumValue = inputPhoneNum.value;
    let emailValue = inputEmail.value;
    let addressValue = inputAddress.value;

    // Build the object we want to send
    let data = {
        id: idValue,
        name: nameValue,
        phoneNum: phoneNumValue,
        email: emailValue,
        address: addressValue
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();

    xhttp.open("PUT", "/put-employee-ajax", true);

    xhttp.setRequestHeader(
        "Content-type",
        "application/json"
    );

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Parse the actual updated Employee
            // returned from MariaDB
            let updatedEmployee =
                JSON.parse(xhttp.responseText);

            // Update the Employee's HTML row
            updateRow(updatedEmployee);

            // Update the Employee name in the dropdown
            updateEmployeeDropdown(updatedEmployee);

            // Clear the update fields
            inputName.value = '';
            inputPhoneNum.value = '';
            inputEmail.value = '';
            inputAddress.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error updating the employee.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Update the Employee's existing HTML table row
function updateRow(updatedEmployee) {

    // Find the row belonging to this Employee
    let row = document.querySelector(
        `#employees-table tbody tr[data-value="${updatedEmployee.idEmployee}"]`
    );

    if (!row) {
        return;
    }

    // Get the <td> cells from this row
    let cells = row.getElementsByTagName("td");

    /*
        Employee table layout:

        cells[0] = idEmployee
        cells[1] = idPassword
        cells[2] = name
        cells[3] = phoneNum
        cells[4] = email
        cells[5] = address
        cells[6] = Delete button
    */

    cells[0].innerText = updatedEmployee.idEmployee;
    cells[1].innerText = updatedEmployee.idPassword;
    cells[2].innerText = updatedEmployee.name;
    cells[3].innerText = updatedEmployee.phoneNum;
    cells[4].innerText = updatedEmployee.email;
    cells[5].innerText = updatedEmployee.address;
}


// Update the Employee's displayed name in the Update dropdown
function updateEmployeeDropdown(updatedEmployee) {

    let selectMenu =
        document.getElementById("employee-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${updatedEmployee.idEmployee}"]`
    );

    if (option) {
        option.text =
            `${updatedEmployee.name} (ID ${updatedEmployee.idEmployee})`;
    }
}