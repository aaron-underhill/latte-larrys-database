// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let addOrderForm = document.getElementById('add-order-form-ajax');

// Modify the objects we need
addOrderForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputEmployee =
        document.getElementById("input-employee");

    let inputCustomer =
        document.getElementById("input-customer");

    let inputMinutesToProcess =
        document.getElementById("input-minutesToProcess");

    let inputOrderDate =
        document.getElementById("input-orderDate");

    // Get their current values
    let employeeValue = inputEmployee.value;
    let customerValue = inputCustomer.value;
    let minutesToProcessValue = inputMinutesToProcess.value;
    let orderDateValue = inputOrderDate.value;

    // Build the object we want to send
    let data = {
        idEmployee: employeeValue,
        idCustomer: customerValue,
        minutesToProcess: minutesToProcessValue,
        orderDate: orderDateValue
    };

    // Create an XMLHttpRequest object
    let xhttp = new XMLHttpRequest();

    // Configure the request
    xhttp.open("POST", "/add-order-ajax", true);

    // Tell the server we're sending JSON
    xhttp.setRequestHeader(
        "Content-type",
        "application/json"
    );

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (
            xhttp.readyState == 4 &&
            xhttp.status == 201
        ) {

            // Parse the actual Order returned from MariaDB
            let newOrder =
                JSON.parse(xhttp.responseText);

            // Add the new Order to the table
            addRowToTable(newOrder);

            // Reset the form
            inputEmployee.value = '';
            inputCustomer.value = '';
            inputMinutesToProcess.value = '';
            inputOrderDate.value = '';
        }

        else if (
            xhttp.readyState == 4 &&
            xhttp.status != 201
        ) {
            console.log(
                "There was an error creating the Order."
            );

            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Creates a single table row representing one Order
function addRowToTable(newOrder) {

    // Get the <tbody> belonging to our Order table
    let tableBody =
        document.querySelector("#orders-table tbody");

    // Create a row and its cells
    let row = document.createElement("TR");

    let idOrderCell =
        document.createElement("TD");

    let idEmployeeCell =
        document.createElement("TD");

    let idCustomerCell =
        document.createElement("TD");

    let totalPriceCell =
        document.createElement("TD");

    let minutesToProcessCell =
        document.createElement("TD");

    let orderDateCell =
        document.createElement("TD");

    let deleteCell =
        document.createElement("TD");

    // Create Delete button
    let deleteButton =
        document.createElement("button");

    // Fill the cells
    idOrderCell.innerText =
        newOrder.idOrder;

    idEmployeeCell.innerText =
        newOrder.idEmployee ?? '';

    idCustomerCell.innerText =
        newOrder.idCustomer ?? '';

    // A brand-new Order starts at $0.00 because
    // it does not have any Drinks yet.
    totalPriceCell.innerText =
        newOrder.totalPrice;

    minutesToProcessCell.innerText =
        newOrder.minutesToProcess;

    orderDateCell.innerText =
        newOrder.orderDate;

    // Configure Delete button
    deleteButton.innerText = "Delete";

    deleteButton.onclick = function () {
        deleteOrder(newOrder.idOrder);
    };

    deleteCell.appendChild(deleteButton);

    // Add the cells to the row
    row.appendChild(idOrderCell);
    row.appendChild(idEmployeeCell);
    row.appendChild(idCustomerCell);
    row.appendChild(totalPriceCell);
    row.appendChild(minutesToProcessCell);
    row.appendChild(orderDateCell);
    row.appendChild(deleteCell);

    // Store the Order ID on the row
    row.setAttribute(
        "data-value",
        newOrder.idOrder
    );

    // Add the completed row to the table
    tableBody.appendChild(row);

    // Add the Order to the Update dropdown
    let selectMenu =
        document.getElementById("order-select");

    if (selectMenu) {

        let option =
            document.createElement("option");

        option.text =
            `Order ${newOrder.idOrder}`;

        option.value =
            newOrder.idOrder;

        selectMenu.add(option);
    }
}