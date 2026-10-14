// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let updateOrderForm =
    document.getElementById('update-order-form-ajax');

// Modify the objects we need
updateOrderForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputOrder =
        document.getElementById("order-select");

    let inputEmployee =
        document.getElementById("update-employee");

    let inputCustomer =
        document.getElementById("update-customer");

    let inputMinutesToProcess =
        document.getElementById(
            "update-minutesToProcess"
        );

    let inputOrderDate =
        document.getElementById("update-date");

    // Get their values
    let orderValue =
        inputOrder.value;

    let employeeValue =
        inputEmployee.value;

    let customerValue =
        inputCustomer.value;

    let minutesToProcessValue =
        inputMinutesToProcess.value;

    let orderDateValue =
        inputOrderDate.value;

    // Build the object to send
    let data = {
        id: orderValue,
        idEmployee: employeeValue,
        idCustomer: customerValue,
        minutesToProcess: minutesToProcessValue,
        orderDate: orderDateValue
    };

    // Setup AJAX request
    let xhttp =
        new XMLHttpRequest();

    xhttp.open(
        "PUT",
        "/put-order-ajax",
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
            xhttp.status == 200
        ) {

            let updatedOrder =
                JSON.parse(xhttp.responseText);

            updateRow(updatedOrder);

            // Reset editable fields
            inputEmployee.value = '';
            inputCustomer.value = '';
            inputMinutesToProcess.value = '';
            inputOrderDate.value = '';
        }

        else if (
            xhttp.readyState == 4 &&
            xhttp.status != 200
        ) {

            console.log(
                "There was an error updating the Order."
            );

            console.log(xhttp.responseText);
        }
    };

    // Send request
    xhttp.send(JSON.stringify(data));
});


// Update the existing Order row
function updateRow(updatedOrder) {

    let row = document.querySelector(
        `#orders-table tbody tr[data-value="${updatedOrder.idOrder}"]`
    );

    if (!row) {
        return;
    }

    let cells =
        row.getElementsByTagName("td");

    /*
        Order table layout:

        cells[0] = idOrder
        cells[1] = idEmployee
        cells[2] = idCustomer
        cells[3] = totalPrice
        cells[4] = minutesToProcess
        cells[5] = orderDate
        cells[6] = Delete button
    */

    cells[0].innerText =
        updatedOrder.idOrder;

    cells[1].innerText =
        updatedOrder.idEmployee ?? '';

    cells[2].innerText =
        updatedOrder.idCustomer ?? '';

    // We display totalPrice, but never manually update it.
    cells[3].innerText =
        updatedOrder.totalPrice;

    cells[4].innerText =
        updatedOrder.minutesToProcess;

    cells[5].innerText =
        updatedOrder.orderDate;
}