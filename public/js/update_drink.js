// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let updateDrinkForm =
    document.getElementById('update-drink-form-ajax');

// Modify the objects we need
updateDrinkForm.addEventListener("submit", function (e) {

    // Prevent normal form submission
    e.preventDefault();

    // Get form fields
    let inputID =
        document.getElementById("drink-select");

    let inputName =
        document.getElementById("input-name-update");

    let inputDescription =
        document.getElementById("input-description-update");

    let inputPrice =
        document.getElementById("input-price-update");

    // Get their current values
    let idValue = inputID.value;
    let nameValue = inputName.value;
    let descriptionValue = inputDescription.value;
    let priceValue = inputPrice.value;

    // Build the object we want to send
    let data = {
        id: idValue,
        name: nameValue,
        description: descriptionValue,
        price: priceValue
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();

    xhttp.open("PUT", "/put-drink-ajax", true);

    xhttp.setRequestHeader(
        "Content-type",
        "application/json"
    );

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Parse the actual updated Drink
            // returned from MariaDB
            let updatedDrink =
                JSON.parse(xhttp.responseText);

            // Update the HTML table
            updateRow(updatedDrink);

            // Update the Drink's name in the dropdown
            updateDrinkDropdown(updatedDrink);

            // Clear the update fields
            inputName.value = '';
            inputDescription.value = '';
            inputPrice.value = '';
        }

        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error updating the drink.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
});


// Update the Drink's existing HTML table row
function updateRow(updatedDrink) {

    // Find the row belonging to this Drink
    let row = document.querySelector(
        `#drinks-table tbody tr[data-value="${updatedDrink.idDrink}"]`
    );

    if (!row) {
        return;
    }

    // Get the <td> cells belonging to this row
    let cells = row.getElementsByTagName("td");

    /*
        Drink table layout:

        cells[0] = idDrink
        cells[1] = name
        cells[2] = description
        cells[3] = price
        cells[4] = Delete button
    */

    cells[0].innerText = updatedDrink.idDrink;
    cells[1].innerText = updatedDrink.name;
    cells[2].innerText = updatedDrink.description;
    cells[3].innerText = updatedDrink.price;
}


// Update the Drink's displayed name in the Update dropdown
function updateDrinkDropdown(updatedDrink) {

    let selectMenu =
        document.getElementById("drink-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${updatedDrink.idDrink}"]`
    );

    if (option) {
        option.text =
            `${updatedDrink.name} (ID ${updatedDrink.idDrink})`;
    }
}