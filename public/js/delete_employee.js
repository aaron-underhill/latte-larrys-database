// Code adapted from nodejs-start-app from course github to fit our database


// Delete an Employee
function deleteEmployee(employeeID) {

    // Put our data we want to send in a JavaScript object
    let data = {
        id: employeeID
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", "/delete-employee-ajax", true);

    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Remove the Employee from the HTML table
            deleteRow(employeeID);

            // Remove the Employee from the Update dropdown
            deleteEmployeeFromDropdown(employeeID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error deleting the employee.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
}


// Remove the Employee's row from the HTML table
function deleteRow(employeeID) {

    let row = document.querySelector(
        `#employees-table tbody tr[data-value="${employeeID}"]`
    );

    if (row) {
        row.remove();
    }
}


// Remove the Employee from the Update dropdown
function deleteEmployeeFromDropdown(employeeID) {

    let selectMenu =
        document.getElementById("employee-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${employeeID}"]`
    );

    if (option) {
        option.remove();
    }
}