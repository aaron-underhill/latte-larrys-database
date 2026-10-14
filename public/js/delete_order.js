// Code adapted from nodejs-start-app from course github to fit our database


// Delete an Order
function deleteOrder(orderID) {

    // Put our data we want to send in a JavaScript object
    let data = {
        id: orderID
    };

    // Setup our AJAX request
    let xhttp =
        new XMLHttpRequest();

    xhttp.open(
        "DELETE",
        "/delete-order-ajax",
        true
    );

    xhttp.setRequestHeader(
        "Content-type",
        "application/json"
    );

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (
            xhttp.readyState == 4 &&
            xhttp.status == 204
        ) {

            // Remove the Order from the HTML table
            deleteRow(orderID);

            // Remove it from the Update dropdown
            deleteOrderFromDropdown(orderID);
        }

        else if (
            xhttp.readyState == 4 &&
            xhttp.status != 204
        ) {
            console.log(
                "There was an error deleting the Order."
            );

            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
}


// Remove the Order from the HTML table
function deleteRow(orderID) {

    let row = document.querySelector(
        `#orders-table tbody tr[data-value="${orderID}"]`
    );

    if (row) {
        row.remove();
    }
}


// Remove the Order from the Update dropdown
function deleteOrderFromDropdown(orderID) {

    let selectMenu =
        document.getElementById("order-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${orderID}"]`
    );

    if (option) {
        option.remove();
    }
}