// Code adapted from nodejs-start-app from course github to fit our database


// Get the form we need to modify
let addOrderForm =
    document.getElementById('add-order-form-ajax');


// Handle form submission
addOrderForm.addEventListener(
    "submit",
    function (e) {

        // Prevent normal form submission
        e.preventDefault();


        // Get form fields
        let inputEmployee =
            document.getElementById(
                "input-employee"
            );

        let inputCustomer =
            document.getElementById(
                "input-customer"
            );

        let inputMinutesToProcess =
            document.getElementById(
                "input-minutesToProcess"
            );

        let inputDate =
            document.getElementById(
                "input-date"
            );


        // Get current values
        let employeeValue =
            inputEmployee.value;

        let customerValue =
            inputCustomer.value;

        let minutesValue =
            inputMinutesToProcess.value;

        let dateValue =
            inputDate.value;


        // Build object to send to Express
        let data = {
            idEmployee: employeeValue,
            idCustomer: customerValue,
            minutesToProcess: minutesValue,
            orderDate: dateValue
        };


        // Setup AJAX request
        let xhttp =
            new XMLHttpRequest();


        xhttp.open(
            "POST",
            "/add-order-ajax",
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

                let newOrder =
                    JSON.parse(
                        xhttp.responseText
                    );


                // Add the returned Order
                // to the current HTML table.
                addRowToTable(
                    newOrder
                );


                // Reset form
                inputEmployee.value = '';
                inputCustomer.value = '';
                inputMinutesToProcess.value = '';
                inputDate.value = '';
            }

            else if (
                xhttp.readyState == 4 &&
                xhttp.status != 201
            ) {

                console.log(
                    "There was an error adding the Order."
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


// Add one Order to the HTML table
function addRowToTable(newOrder) {

    let tableBody =
        document.querySelector(
            "#orders-table tbody"
        );


    // Create row
    let row =
        document.createElement("TR");


    // Create cells
    let idOrderCell =
        document.createElement("TD");

    let idEmployeeCell =
        document.createElement("TD");

    let idCustomerCell =
        document.createElement("TD");

    let totalPriceCell =
        document.createElement("TD");

    let minutesCell =
        document.createElement("TD");

    let dateCell =
        document.createElement("TD");

    let deleteCell =
        document.createElement("TD");


    // Create Delete button
    let deleteButton =
        document.createElement("button");


    // Fill cells
    idOrderCell.innerText =
        newOrder.idOrder;

    idEmployeeCell.innerText =
        newOrder.idEmployee;

    idCustomerCell.innerText =
        newOrder.idCustomer;

    totalPriceCell.innerText =
        '$' +
        Number(
            newOrder.totalPrice
        ).toFixed(2);

    minutesCell.innerText =
        newOrder.minutesToProcess;

    dateCell.innerText =
        newOrder.orderDate;


    // Configure Delete button
    deleteButton.innerText =
        "Delete";

    deleteButton.type =
        "button";

    deleteButton.classList.add(
        "button",
        "button-danger"
    );

    deleteButton.onclick =
        function () {

            deleteOrder(
                newOrder.idOrder
            );
        };


    deleteCell.appendChild(
        deleteButton
    );


    // Add cells to row
    row.appendChild(
        idOrderCell
    );

    row.appendChild(
        idEmployeeCell
    );

    row.appendChild(
        idCustomerCell
    );

    row.appendChild(
        totalPriceCell
    );

    row.appendChild(
        minutesCell
    );

    row.appendChild(
        dateCell
    );

    row.appendChild(
        deleteCell
    );


    // Store Order ID on row
    row.setAttribute(
        "data-value",
        newOrder.idOrder
    );


    // Add row to table
    tableBody.appendChild(
        row
    );


    // Add new Order to the
    // Update dropdown
    let selectMenu =
        document.getElementById(
            "order-select"
        );


    if (selectMenu) {

        let option =
            document.createElement(
                "option"
            );

        option.text =
            `Order ${newOrder.idOrder}`;

        option.value =
            newOrder.idOrder;

        selectMenu.add(
            option
        );
    }
}