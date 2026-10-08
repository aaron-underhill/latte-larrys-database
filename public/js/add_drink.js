// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let addDrinkForm = document.getElementById('add-drink-form-ajax');

// Modify the objects we need
addDrinkForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputDescription = document.getElementById("input-description");
    let inputPrice = document.getElementById("input-price");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let descriptionValue = inputDescription.value;
    let priceValue = inputPrice.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        description: descriptionValue,
        price: priceValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-drink-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputDescription.value = '';
            inputPrice.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("drinks-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idDrinkCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descCell = document.createElement("TD");
    let priceCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idDrinkCell.innerText = newRow.idDrink;
    nameCell.innerText = newRow.name;
    descCell.innerText = newRow.description;
    priceCell.innerText = newRow.price;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.idDrink);
    };



    // Add the cells to the row 
    row.appendChild(idDrinkCell);
    row.appendChild(nameCell);
    row.appendChild(descCell);
    row.appendChild(priceCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fname + ' ' +  newRow.lname;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}