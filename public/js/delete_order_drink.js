// Code adapted from nodejs-start-app from course github to fit our database


// Remove a Drink from an Order
function deleteOrderDrink(orderDrinkID) {

    // Build the object to send
    let data = {
        id: orderDrinkID
    };

    // Setup AJAX request
    let xhttp =
        new XMLHttpRequest();

    xhttp.open(
        "DELETE",
        "/delete-order_drink-ajax",
        true
    );

    xhttp.setRequestHeader(
        "Content-type",
        "application/json"
    );

    // Handle response
    xhttp.onreadystatechange = () => {

        if (
            xhttp.readyState == 4 &&
            xhttp.status == 204
        ) {

            // Remove the relationship from
            // the current HTML table.
            deleteRow(orderDrinkID);

            // Remove it from the Update dropdown.
            deleteOrderDrinkFromDropdown(
                orderDrinkID
            );
        }

        else if (
            xhttp.readyState == 4 &&
            xhttp.status != 204
        ) {

            console.log(
                "There was an error removing the Drink from the Order."
            );

            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
}


// Remove the row from the HTML table
function deleteRow(orderDrinkID) {

    let row = document.querySelector(
        `#orders_drinks-table tbody tr[data-value="${orderDrinkID}"]`
    );

    if (row) {
        row.remove();
    }
}


// Remove the relationship from the Update dropdown
function deleteOrderDrinkFromDropdown(orderDrinkID) {

    let selectMenu =
        document.getElementById(
            "order-drink-select"
        );

    if (!selectMenu) {
        return;
    }

    let option =
        selectMenu.querySelector(
            `option[value="${orderDrinkID}"]`
        );

    if (option) {
        option.remove();
    }
}