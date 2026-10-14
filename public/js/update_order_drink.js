// Code adapted from nodejs-start-app from course github to fit our database

// Get the form we need to modify
let updateOrderDrinkForm =
    document.getElementById(
        'update-order_drink-form-ajax'
    );


// Handle Update form submission
updateOrderDrinkForm.addEventListener(
    "submit",
    function (e) {

        // Prevent normal form submission
        e.preventDefault();

        // Get form fields
        let inputOrderDrink =
            document.getElementById(
                "order-drink-select"
            );

        let inputOrder =
            document.getElementById(
                "update-order"
            );

        let inputDrink =
            document.getElementById(
                "update-drink"
            );

        let inputQuantity =
            document.getElementById(
                "update-quantity"
            );

        // Get values
        let orderDrinkValue =
            inputOrderDrink.value;

        let orderValue =
            inputOrder.value;

        let drinkValue =
            inputDrink.value;

        let quantityValue =
            inputQuantity.value;

        // Build object to send
        let data = {
            id: orderDrinkValue,
            idOrder: orderValue,
            idDrink: drinkValue,
            quantity: quantityValue
        };

        // Setup AJAX request
        let xhttp =
            new XMLHttpRequest();

        xhttp.open(
            "PUT",
            "/put-order_drink-ajax",
            true
        );

        xhttp.setRequestHeader(
            "Content-type",
            "application/json"
        );

        // Handle server response
        xhttp.onreadystatechange = () => {

            if (
                xhttp.readyState == 4 &&
                xhttp.status == 200
            ) {

                let updatedOrderDrink =
                    JSON.parse(
                        xhttp.responseText
                    );

                // Update the table
                updateRow(
                    updatedOrderDrink
                );

                // Update its dropdown text
                updateOrderDrinkDropdown(
                    updatedOrderDrink
                );

                // Reset editable fields
                inputOrder.value = '';
                inputDrink.value = '';
                inputQuantity.value = '';
            }

            else if (
                xhttp.readyState == 4 &&
                xhttp.status != 200
            ) {

                console.log(
                    "There was an error updating the Order-Drink."
                );

                console.log(
                    xhttp.responseText
                );
            }
        };

        // Send request
        xhttp.send(
            JSON.stringify(data)
        );
    }
);


// Update the existing HTML row
function updateRow(updatedOrderDrink) {

    let row =
        document.querySelector(
            `#orders_drinks-table tbody tr[data-value="${updatedOrderDrink.idOrderDrink}"]`
        );

    if (!row) {
        return;
    }

    let cells =
        row.getElementsByTagName("td");

    /*
        Orders_Drinks table layout:

        cells[0] = idOrderDrink
        cells[1] = idOrder
        cells[2] = idDrink
        cells[3] = quantity
        cells[4] = drinkTotal
        cells[5] = Delete button
    */

    cells[0].innerText =
        updatedOrderDrink.idOrderDrink;

    cells[1].innerText =
        updatedOrderDrink.idOrder;

    cells[2].innerText =
        `${updatedOrderDrink.idDrink} - ${updatedOrderDrink.drinkName}`;

    cells[3].innerText =
        updatedOrderDrink.quantity;

    cells[4].innerText =
        updatedOrderDrink.drinkTotal;
}


// Update the text displayed in the Update dropdown
function updateOrderDrinkDropdown(updatedOrderDrink) {

    let selectMenu =
        document.getElementById(
            "order-drink-select"
        );

    if (!selectMenu) {
        return;
    }

    let option =
        selectMenu.querySelector(
            `option[value="${updatedOrderDrink.idOrderDrink}"]`
        );

    if (option) {

        option.text =
            `Order ${updatedOrderDrink.idOrder}: ${updatedOrderDrink.drinkName} (Line ${updatedOrderDrink.idOrderDrink})`;
    }
}