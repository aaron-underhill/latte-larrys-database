// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let addDrinkForm = document.getElementById('add-drink-form-ajax');

// Modify the objects we need
addDrinkForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputName = document.getElementById("input-name");
    let inputDescription = document.getElementById("input-description");
    let inputPrice = document.getElementById("input-price");

    // Get their current values
    let nameValue = inputName.value;
    let descriptionValue = inputDescription.value;
    let priceValue = inputPrice.value;

    // Build the object we want to send
    let data = {
        name: nameValue,
        description: descriptionValue,
        price: priceValue
    };

    // Create an XMLHttpRequest object
    let xhttp = new XMLHttpRequest();

    // Configure the request
    xhttp.open("POST", "/add-drink-ajax", true);

    // Tell the server we're sending JSON
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 201) {

            // Parse the actual newly-created Drink
            // that was SELECTed back from MariaDB
            let newDrink = JSON.parse(xhttp.responseText);

            // Add the new Drink to the HTML table
            addRowToTable(newDrink);

            // Clear the input fields
            inputName.value = '';
            inputDescription.value = '';
            inputPrice.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 201) {
            console.log("There was an error creating the drink.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Creates a single table row representing one Drink
function addRowToTable(newDrink) {

    // Get the <tbody> belonging to our Drinks table
    let tableBody = document.querySelector("#drinks-table tbody");

    // Create a row and its cells
    let row = document.createElement("TR");

    let idDrinkCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let priceCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Create the Delete button
    let deleteButton = document.createElement("button");

    // Fill the cells using the data returned by the server
    idDrinkCell.innerText = newDrink.idDrink;
    nameCell.innerText = newDrink.name;
    descriptionCell.innerText = newDrink.description;
    priceCell.innerText = newDrink.price;

    // Configure the Delete button
    deleteButton.innerText = "Delete";

    deleteButton.onclick = function () {
        deleteDrink(newDrink.idDrink);
    };

    // Put the button inside the Delete cell
    deleteCell.appendChild(deleteButton);

    // Put all cells inside the row
    row.appendChild(idDrinkCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(priceCell);
    row.appendChild(deleteCell);

    // Store the Drink ID on the row
    row.setAttribute("data-value", newDrink.idDrink);

    // Add the completed row to the table body
    tableBody.appendChild(row);

    // Also add the new Drink to the Update dropdown
    // without requiring a page refresh
    let selectMenu = document.getElementById("drink-select");

    if (selectMenu) {

        let option = document.createElement("option");

        option.text =
            `${newDrink.name} (ID ${newDrink.idDrink})`;

        option.value = newDrink.idDrink;

        selectMenu.add(option);
    }
}