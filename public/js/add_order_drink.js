// Code adapted from nodejs-start-app from course github to fit our database

// Get the form we need to modify
let addOrderDrinkForm =
    document.getElementById('add-order_drink-form-ajax');


// Handle form submission
addOrderDrinkForm.addEventListener(
    "submit",
    function (e) {

        // Prevent normal form submission
        e.preventDefault();

        // Get form fields
        let inputOrder =
            document.getElementById("input-order");

        let inputDrink =
            document.getElementById("input-drink");

        let inputQuantity =
            document.getElementById("input-quantity");

        // Get their current values
        let orderValue =
            inputOrder.value;

        let drinkValue =
            inputDrink.value;

        let quantityValue =
            inputQuantity.value;

        // Build the object to send
        let data = {
            idOrder: orderValue,
            idDrink: drinkValue,
            quantity: quantityValue
        };

        // Setup AJAX request
        let xhttp =
            new XMLHttpRequest();

        xhttp.open(
            "POST",
            "/add-order_drink-ajax",
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
                xhttp.status == 201
            ) {

                let newOrderDrink =
                    JSON.parse(xhttp.responseText);

                // Add the returned line item
                // to the current HTML table.
                addRowToTable(newOrderDrink);

                // Reset the form
                inputOrder.value = '';
                inputDrink.value = '';
                inputQuantity.value = '';
            }

            else if (
                xhttp.readyState == 4 &&
                xhttp.status != 201
            ) {

                console.log(
                    "There was an error adding the Drink to the Order."
                );

                console.log(xhttp.responseText);
            }
        };

        // Send the request
        xhttp.send(JSON.stringify(data));
    }
);


// Add one Order-Drink relationship to the HTML table
function addRowToTable(newOrderDrink) {

    let tableBody =
        document.querySelector(
            "#orders_drinks-table tbody"
        );

    // Create row
    let row =
        document.createElement("TR");

    // Create cells
    let idOrderDrinkCell =
        document.createElement("TD");

    let idOrderCell =
        document.createElement("TD");

    let idDrinkCell =
        document.createElement("TD");

    let quantityCell =
        document.createElement("TD");

    let drinkTotalCell =
        document.createElement("TD");

    let deleteCell =
        document.createElement("TD");

    // Create Delete button
    let deleteButton =
        document.createElement("button");

    // Fill the cells
    idOrderDrinkCell.innerText =
        newOrderDrink.idOrderDrink;

    idOrderCell.innerText =
        newOrderDrink.idOrder;

    idDrinkCell.innerText =
        `${newOrderDrink.idDrink} - ${newOrderDrink.drinkName}`;

    quantityCell.innerText =
        newOrderDrink.quantity;

    drinkTotalCell.innerText =
        '$' +
        Number(
            newOrderDrink.drinkTotal
        ).toFixed(2);

    // Configure Delete button
    deleteButton.innerText = "Delete";
    deleteButton.type = 'button';

    deleteButton.classList.add(
        'button',
        'button-danger'
    );

    deleteButton.onclick = function () {

        deleteOrderDrink(
            newOrderDrink.idOrderDrink
        );
    };

    deleteCell.appendChild(deleteButton);

    // Add cells to row
    row.appendChild(idOrderDrinkCell);
    row.appendChild(idOrderCell);
    row.appendChild(idDrinkCell);
    row.appendChild(quantityCell);
    row.appendChild(drinkTotalCell);
    row.appendChild(deleteCell);

    // Store idOrderDrink on the row
    row.setAttribute(
        "data-value",
        newOrderDrink.idOrderDrink
    );

    // Add row to table
    tableBody.appendChild(row);

    // Add it to the Update dropdown
    let selectMenu =
        document.getElementById(
            "order-drink-select"
        );

    if (selectMenu) {

        let option =
            document.createElement("option");

        option.text =
            `Order ${newOrderDrink.idOrder}: ${newOrderDrink.drinkName} (Line ${newOrderDrink.idOrderDrink})`;

        option.value =
            newOrderDrink.idOrderDrink;

        selectMenu.add(option);
    }
}