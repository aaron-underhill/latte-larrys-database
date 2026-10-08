// Code adapted from nodejs-start-app from course github to fit our database

// Get the objects we need to modify
let addEmployeeForm = document.getElementById('add-employee-form-ajax');

// Modify the objects we need
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputPassword = document.getElementById("input-password");
    let inputPhoneNum = document.getElementById("input-phoneNum");
    let inputEmail = document.getElementById("input-email");
    let inputAddress = document.getElementById("input-address");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let passwordValue = inputPassword.value;
    let phoneNumValue = inputPhoneNum.value;
    let emailValue = inputEmail.value;
    let addressValue = inputAddress.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        idPassword: passwordValue,
        phoneNum: phoneNumValue,
        email: emailValue,
        address: addressValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employee-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputPassword.value = '';
            inputPhoneNum.value = '';
            inputEmail.value = '';
            inputAddress.value = '';
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
    let currentTable = document.getElementById("employees-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idEmployeeCell = document.createElement("TD");
    let idPasswordCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let phoneNumCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let addressCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idEmployeeCell.innerText = newRow.idEmployee;
    idPasswordCell.innerText = newRow.idPassword;
    nameCell.innerText = newRow.name;
    phoneNumCell.innerText = newRow.phoneNum;
    emailCell.innerText = newRow.email;
    addressCell.innerText = newRow.address;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.idEmployee);
    };



    // Add the cells to the row 
    row.appendChild(idEmployeeCell);
    row.appendChild(idPasswordCell);
    row.appendChild(nameCell);
    row.appendChild(phoneNumCell);
    row.appendChild(emailCell);
    row.appendChild(addressCell);
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