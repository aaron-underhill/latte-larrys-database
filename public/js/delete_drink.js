// Code adapted from nodejs-start-app from course github to fit our database


// Delete a Drink
function deleteDrink(drinkID) {

    // Put our data we want to send in a JavaScript object
    let data = {
        id: drinkID
    };

    // Setup our AJAX request
    let xhttp = new XMLHttpRequest();

    xhttp.open("DELETE", "/delete-drink-ajax", true);

    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {

        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Remove the Drink from the HTML table
            deleteRow(drinkID);

            // Remove the Drink from the Update dropdown
            deleteDrinkFromDropdown(drinkID);
        }

        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error deleting the drink.");
            console.log(xhttp.responseText);
        }
    };

    // Send the request
    xhttp.send(JSON.stringify(data));
}


// Remove the Drink's row from the HTML table
function deleteRow(drinkID) {

    let row = document.querySelector(
        `#drinks-table tbody tr[data-value="${drinkID}"]`
    );

    if (row) {
        row.remove();
    }
}


// Remove the Drink from the Update dropdown
function deleteDrinkFromDropdown(drinkID) {

    let selectMenu = document.getElementById("drink-select");

    if (!selectMenu) {
        return;
    }

    let option = selectMenu.querySelector(
        `option[value="${drinkID}"]`
    );

    if (option) {
        option.remove();
    }
}