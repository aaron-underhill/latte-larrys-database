// Code adapted from nodejs-start-app from course github to fit our database


// Delete a Customer
function deleteCustomer(customerID) {

    // Put our data we want to send in a JavaScript object
    let data = {
        id: customerID
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", "/delete-customer-ajax", true);

    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Remove the Customer from the HTML table
            deleteRow(customerID);

            // Remove the Customer from the Update dropdown
            deleteCustomerFromDropdown(customerID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error deleting the customer.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


// Remove the Customer's row from the table
function deleteRow(customerID) {

    let row = document.querySelector(
        `#customers-table tbody tr[data-value="${customerID}"]`
    );

    if (row) {
        row.remove();
    }
}


// Remove the Customer from the Update dropdown
function deleteCustomerFromDropdown(customerID) {

    let selectMenu = document.getElementById("customer-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${customerID}"]`
    );

    if (option) {
        option.remove();
    }
}