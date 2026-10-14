/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The basis of the following starter code was adapted from the course's nodejs-start-app repository, specifcally following step 3
// source : https://github.com/osu-cs340-ecampus/nodejs-starter-app
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
    SETUP
*/
const express = require('express');   // We are using the express library for the web server
const path = require('path');
const app = express();                // We need to instantiate an express object to interact with the server in our code
const PORT = 26801;                   // Set a port number at the top so it's easy to change in the future

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Import express-handlebars
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: '.hbs' }));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                   // Tell express to use the handlebars engine whenever it encounters a *.hbs file

// Database
const db = require('./database/db-connector');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for the home page
app.get('/', (req, res) => {
    const query1 = "SELECT * FROM Customers;";

    db.pool.query(query1, (error, rows, fields) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        } else {
            res.render('index', { data: rows });
        }
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The basis of each tables app function was adapted from the course's nodejs-start-app repository, specifcally following step 8
// source : https://github.com/osu-cs340-ecampus/nodejs-starter-app
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   CUSTOMERS PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ----------------------------------------------------
// CUSTOMER ROUTES
// ----------------------------------------------------

// ----------------------------------------------------
// CUSTOMER ROUTES
// ----------------------------------------------------


// READ: Display all customers
app.get('/customers', function (req, res) {

    // Get all Customers from the database
    let query1 = `
        SELECT * FROM Customers;
    `;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Render customers.hbs and make the returned rows
        // available inside Handlebars through the variable "data"
        res.render('customers', {
            data: rows
        });
    });
});


// CREATE: Add a new customer
app.post('/add-customer-ajax', function (req, res) {

    // Capture the JSON request body
    let data = req.body;

    // Clean the incoming values
    let name = data.name?.trim();
    let phoneNum = data.phoneNum?.trim() || null;
    let email = data.email?.trim() || null;

    // Name is required by the database
    if (!name) {
        return res.status(400).json({
            error: "Customer name is required."
        });
    }

    // Insert the Customer
    let insertCustomerQuery = `
        INSERT INTO Customers (name, phoneNum, email)
        VALUES (?, ?, ?)
    `;

    db.pool.query(
        insertCustomerQuery,
        [name, phoneNum, email],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // MariaDB automatically generated this ID
            let newCustomerID = result.insertId;

            // Retrieve the actual newly-created row from MariaDB
            let selectCustomerQuery = `
                SELECT *
                FROM Customers
                WHERE idCustomer = ?
            `;

            db.pool.query(
                selectCustomerQuery,
                [newCustomerID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    // Since idCustomer is a primary key,
                    // this SELECT can return at most one Customer.
                    let newCustomer = rows[0];

                    // Send the actual stored Customer to the browser
                    res.status(201).json(newCustomer);
                }
            );
        }
    );
});


// DELETE: Delete a customer
app.delete('/delete-customer-ajax', function (req, res) {

    let data = req.body;

    let customerID = parseInt(data.id, 10);

    // Make sure we received a valid ID
    if (Number.isNaN(customerID)) {
        return res.status(400).json({
            error: "A valid customer ID is required."
        });
    }

    let deleteCustomerQuery = `
        DELETE FROM Customers
        WHERE idCustomer = ?
    `;

    db.pool.query(
        deleteCustomerQuery,
        [customerID],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // No Customer with this ID existed
            if (result.affectedRows === 0) {
                return res.sendStatus(404);
            }

            // Success, with no response body
            res.sendStatus(204);
        }
    );
});


// UPDATE: Update a customer
app.put('/put-customer-ajax', function (req, res) {

    let data = req.body;

    let customerID = parseInt(data.id, 10);

    let name = data.name?.trim();
    let phoneNum = data.phoneNum?.trim() || null;
    let email = data.email?.trim() || null;

    // Make sure the ID is valid
    if (Number.isNaN(customerID)) {
        return res.status(400).json({
            error: "A valid customer ID is required."
        });
    }

    // Name cannot be NULL or empty
    if (!name) {
        return res.status(400).json({
            error: "Customer name is required."
        });
    }

    // Update the Customer
    let updateCustomerQuery = `
        UPDATE Customers
        SET name = ?,
            phoneNum = ?,
            email = ?
        WHERE idCustomer = ?
    `;

    db.pool.query(
        updateCustomerQuery,
        [name, phoneNum, email, customerID],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // No Customer matched that ID
            if (result.affectedRows === 0) {
                return res.sendStatus(404);
            }

            // Retrieve the actual updated row from MariaDB
            let selectCustomerQuery = `
                SELECT *
                FROM Customers
                WHERE idCustomer = ?
            `;

            db.pool.query(
                selectCustomerQuery,
                [customerID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    let updatedCustomer = rows[0];

                    // Send the actual stored version back
                    res.status(200).json(updatedCustomer);
                }
            );
        }
    );
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   CUSTOMERS PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   DRINKS PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ: Display all drinks
app.get('/drinks', function (req, res) {

    // Get all Drinks from the database
    let query1 = `
        SELECT * FROM Drinks;
    `;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Render drinks.hbs and make the returned rows
        // available inside Handlebars through the variable "data"
        res.render('drinks', {
            data: rows
        });
    });
});


// CREATE: Add a new drink
app.post('/add-drink-ajax', function (req, res) {

    // Capture the JSON request body
    let data = req.body;

    // Clean the incoming values
    let name = data.name?.trim();
    let description = data.description?.trim();
    let price = parseFloat(data.price);

    // All Drink fields are NOT NULL in our database,
    // so make sure valid values were provided.
    if (
        !name ||
        !description ||
        Number.isNaN(price)
    ) {
        return res.status(400).json({
            error: "Name, description, and a valid price are required."
        });
    }

    // Insert the new Drink
    let insertDrinkQuery = `
        INSERT INTO Drinks (name, description, price)
        VALUES (?, ?, ?)
    `;

    db.pool.query(
        insertDrinkQuery,
        [name, description, price],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // MariaDB automatically generated the idDrink
            let newDrinkID = result.insertId;

            // Retrieve the actual newly-created Drink from MariaDB
            let selectDrinkQuery = `
                SELECT *
                FROM Drinks
                WHERE idDrink = ?
            `;

            db.pool.query(
                selectDrinkQuery,
                [newDrinkID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    // idDrink is a primary key, so rows[0]
                    // is the newly-created Drink.
                    let newDrink = rows[0];

                    // Send the actual stored row back to the browser
                    res.status(201).json(newDrink);
                }
            );
        }
    );
});


// DELETE: Delete a drink
app.delete('/delete-drink-ajax', function (req, res) {

    let data = req.body;

    let drinkID = parseInt(data.id, 10);

    // Make sure we received a valid Drink ID
    if (Number.isNaN(drinkID)) {
        return res.status(400).json({
            error: "A valid drink ID is required."
        });
    }

    let deleteDrinkQuery = `
        DELETE FROM Drinks
        WHERE idDrink = ?
    `;

    db.pool.query(
        deleteDrinkQuery,
        [drinkID],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // No Drink with this ID existed
            if (result.affectedRows === 0) {
                return res.sendStatus(404);
            }

            // Successful DELETE with no response body
            res.sendStatus(204);
        }
    );
});


// UPDATE: Update a drink
app.put('/put-drink-ajax', function (req, res) {

    let data = req.body;

    let drinkID = parseInt(data.id, 10);

    let name = data.name?.trim();
    let description = data.description?.trim();
    let price = parseFloat(data.price);

    // Validate Drink ID
    if (Number.isNaN(drinkID)) {
        return res.status(400).json({
            error: "A valid drink ID is required."
        });
    }

    // Validate the new Drink information
    if (
        !name ||
        !description ||
        Number.isNaN(price)
    ) {
        return res.status(400).json({
            error: "Name, description, and a valid price are required."
        });
    }

    // Update the Drink
    let updateDrinkQuery = `
        UPDATE Drinks
        SET name = ?,
            description = ?,
            price = ?
        WHERE idDrink = ?
    `;

    db.pool.query(
        updateDrinkQuery,
        [name, description, price, drinkID],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // No Drink matched that ID
            if (result.affectedRows === 0) {
                return res.sendStatus(404);
            }

            // Retrieve the actual updated row from MariaDB
            let selectDrinkQuery = `
                SELECT *
                FROM Drinks
                WHERE idDrink = ?
            `;

            db.pool.query(
                selectDrinkQuery,
                [drinkID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    let updatedDrink = rows[0];

                    // Send the database's actual stored version
                    // back to the browser
                    res.status(200).json(updatedDrink);
                }
            );
        }
    );
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   DRINKS PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   EMPLOYEES PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------------------------
// EMPLOYEE ROUTES
// ----------------------------------------------------


// READ: Display all employees
app.get('/employees', function (req, res) {

    // Get all Employees from the database
    let query1 = `
        SELECT * FROM Employees;
    `;

    db.pool.query(query1, function (error, rows, fields) {

        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }

        // Render employees.hbs and make the returned rows
        // available inside Handlebars through the variable "data"
        res.render('employees', {
            data: rows
        });
    });
});


// CREATE: Add a new employee
app.post('/add-employee-ajax', function (req, res) {

    // Capture the JSON request body
    let data = req.body;

    // Clean the incoming values
    let name = data.name?.trim();
    let password = data.password?.trim();
    let phoneNum = data.phoneNum?.trim();
    let email = data.email?.trim();
    let address = data.address?.trim();

    // All Employee fields are required by our database
    if (
        !name ||
        !password ||
        !phoneNum ||
        !email ||
        !address
    ) {
        return res.status(400).json({
            error: "All employee fields are required."
        });
    }

    // STEP 1:
    // Create the Password record first.
    let insertPasswordQuery = `
        INSERT INTO Passwords (password)
        VALUES (?)
    `;

    db.pool.query(
        insertPasswordQuery,
        [password],
        function (error, passwordResult, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // MariaDB created the idPassword for us
            let newPasswordID = passwordResult.insertId;


            // STEP 2:
            // Create the Employee and connect it to
            // the new Password row using idPassword.
            let insertEmployeeQuery = `
                INSERT INTO Employees
                    (name, idPassword, phoneNum, email, address)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.pool.query(
                insertEmployeeQuery,
                [
                    name,
                    newPasswordID,
                    phoneNum,
                    email,
                    address
                ],
                function (error, employeeResult, fields) {

                    if (error) {
                        console.log(error);

                        // The Password was already created, but the Employee
                        // could not be created. Delete the unused Password row.
                        let cleanupPasswordQuery = `
                            DELETE FROM Passwords
                            WHERE idPassword = ?
                        `;

                        return db.pool.query(
                            cleanupPasswordQuery,
                            [newPasswordID],
                            function (cleanupError) {

                                if (cleanupError) {
                                    console.log(cleanupError);
                                }

                                return res.sendStatus(400);
                            }
                        );
                    }


                    // STEP 3:
                    // Get the actual Employee row back FROM MariaDB.
                    let newEmployeeID = employeeResult.insertId;

                    let selectEmployeeQuery = `
                        SELECT *
                        FROM Employees
                        WHERE idEmployee = ?
                    `;

                    db.pool.query(
                        selectEmployeeQuery,
                        [newEmployeeID],
                        function (error, rows, fields) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(500);
                            }

                            // idEmployee is the primary key,
                            // so rows[0] is the newly-created Employee.
                            let newEmployee = rows[0];

                            // Send the actual stored Employee back to the browser
                            res.status(201).json(newEmployee);
                        }
                    );
                }
            );
        }
    );
});


// DELETE: Delete an employee
app.delete('/delete-employee-ajax', function (req, res) {

    let data = req.body;

    let employeeID = parseInt(data.id, 10);

    // Validate the Employee ID
    if (Number.isNaN(employeeID)) {
        return res.status(400).json({
            error: "A valid employee ID is required."
        });
    }


    // STEP 1:
    // Get this Employee's idPassword before deleting the Employee.
    let selectEmployeeQuery = `
        SELECT idPassword
        FROM Employees
        WHERE idEmployee = ?
    `;

    db.pool.query(
        selectEmployeeQuery,
        [employeeID],
        function (error, rows, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            // No Employee with this ID exists
            if (rows.length === 0) {
                return res.sendStatus(404);
            }

            let passwordID = rows[0].idPassword;


            // STEP 2:
            // Delete the Employee.
            //
            // Orders.idEmployee uses ON DELETE SET NULL,
            // so existing Orders will remain in the database.
            let deleteEmployeeQuery = `
                DELETE FROM Employees
                WHERE idEmployee = ?
            `;

            db.pool.query(
                deleteEmployeeQuery,
                [employeeID],
                function (error, result, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(400);
                    }


                    // STEP 3:
                    // Delete the Password row if no other Employee
                    // is using it.
                    //
                    // Under our intended design, each Employee has
                    // their own Password row.
                    let deletePasswordQuery = `
                        DELETE FROM Passwords
                        WHERE idPassword = ?
                        AND NOT EXISTS (
                            SELECT 1
                            FROM Employees
                            WHERE idPassword = ?
                        )
                    `;

                    db.pool.query(
                        deletePasswordQuery,
                        [passwordID, passwordID],
                        function (error, result, fields) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(500);
                            }

                            // Successful DELETE with no response body
                            res.sendStatus(204);
                        }
                    );
                }
            );
        }
    );
});


// UPDATE: Update an employee
app.put('/put-employee-ajax', function (req, res) {

    let data = req.body;

    let employeeID = parseInt(data.id, 10);

    let name = data.name?.trim();
    let phoneNum = data.phoneNum?.trim();
    let email = data.email?.trim();
    let address = data.address?.trim();

    // Validate Employee ID
    if (Number.isNaN(employeeID)) {
        return res.status(400).json({
            error: "A valid employee ID is required."
        });
    }

    // All Employee information being updated is required
    if (
        !name ||
        !phoneNum ||
        !email ||
        !address
    ) {
        return res.status(400).json({
            error: "Name, phone number, email, and address are required."
        });
    }

    // Update the Employee
    let updateEmployeeQuery = `
        UPDATE Employees
        SET name = ?,
            phoneNum = ?,
            email = ?,
            address = ?
        WHERE idEmployee = ?
    `;

    db.pool.query(
        updateEmployeeQuery,
        [
            name,
            phoneNum,
            email,
            address,
            employeeID
        ],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }


            // Retrieve the actual updated Employee from MariaDB
            let selectEmployeeQuery = `
                SELECT *
                FROM Employees
                WHERE idEmployee = ?
            `;

            db.pool.query(
                selectEmployeeQuery,
                [employeeID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    // No Employee with that ID existed
                    if (rows.length === 0) {
                        return res.sendStatus(404);
                    }

                    let updatedEmployee = rows[0];

                    // Send the database's actual stored version
                    // back to the browser
                    res.status(200).json(updatedEmployee);
                }
            );
        }
    );
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   EMPLOYEES PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ: Display all Orders
app.get('/orders', function (req, res) {

    // Get all Orders
    let orderQuery = `
        SELECT
            idOrder,
            idEmployee,
            idCustomer,
            totalPrice,
            minutesToProcess,
            DATE_FORMAT(orderDate, '%Y-%m-%d') AS orderDate
        FROM Orders;
    `;

    // Get Customers for the Customer dropdowns
    let customerQuery = `
        SELECT idCustomer, name
        FROM Customers;
    `;

    // Get Employees for the Employee dropdowns
    let employeeQuery = `
        SELECT idEmployee, name
        FROM Employees;
    `;

    db.pool.query(
        orderQuery,
        function (error, orderRows, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            db.pool.query(
                customerQuery,
                function (error, customerRows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    db.pool.query(
                        employeeQuery,
                        function (error, employeeRows, fields) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(500);
                            }

                            // Render orders.hbs and provide all three
                            // sets of database information.
                            res.render('orders', {
                                orderData: orderRows,
                                customerData: customerRows,
                                employeeData: employeeRows
                            });
                        }
                    );
                }
            );
        }
    );
});


// CREATE: Add a new Order
app.post('/add-order-ajax', function (req, res) {

    // Capture the JSON request body
    let data = req.body;

    let employeeID = parseInt(data.idEmployee, 10);
    let customerID = parseInt(data.idCustomer, 10);
    let minutesToProcess = parseFloat(data.minutesToProcess);
    let orderDate = data.orderDate?.trim();

    // Validate the incoming values
    if (
        Number.isNaN(employeeID) ||
        Number.isNaN(customerID) ||
        Number.isNaN(minutesToProcess) ||
        !orderDate
    ) {
        return res.status(400).json({
            error: "Employee, customer, processing time, and order date are required."
        });
    }

    if (minutesToProcess < 0) {
        return res.status(400).json({
            error: "Processing time cannot be negative."
        });
    }

    // totalPrice is NOT supplied here.
    //
    // MariaDB will initialize it to 0.00 because the new Order
    // does not have any Drinks yet.
    let insertOrderQuery = `
        INSERT INTO Orders
            (idEmployee, idCustomer, minutesToProcess, orderDate)
        VALUES (?, ?, ?, ?)
    `;

    db.pool.query(
        insertOrderQuery,
        [
            employeeID,
            customerID,
            minutesToProcess,
            orderDate
        ],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            let newOrderID = result.insertId;

            // Retrieve the actual newly-created Order from MariaDB
            let selectOrderQuery = `
                SELECT
                    idOrder,
                    idEmployee,
                    idCustomer,
                    totalPrice,
                    minutesToProcess,
                    DATE_FORMAT(orderDate, '%Y-%m-%d') AS orderDate
                FROM Orders
                WHERE idOrder = ?
            `;

            db.pool.query(
                selectOrderQuery,
                [newOrderID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    let newOrder = rows[0];

                    // Send the actual stored Order back to the browser
                    res.status(201).json(newOrder);
                }
            );
        }
    );
});


// DELETE: Delete an Order
app.delete('/delete-order-ajax', function (req, res) {

    let data = req.body;

    let orderID = parseInt(data.id, 10);

    if (Number.isNaN(orderID)) {
        return res.status(400).json({
            error: "A valid order ID is required."
        });
    }

    let deleteOrderQuery = `
        DELETE FROM Orders
        WHERE idOrder = ?
    `;

    db.pool.query(
        deleteOrderQuery,
        [orderID],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            if (result.affectedRows === 0) {
                return res.sendStatus(404);
            }

            // Orders_Drinks uses ON DELETE CASCADE.
            //
            // Therefore, deleting the Order automatically deletes
            // its Orders_Drinks relationship rows.
            res.sendStatus(204);
        }
    );
});


// UPDATE: Update an Order
app.put('/put-order-ajax', function (req, res) {

    let data = req.body;

    let orderID = parseInt(data.id, 10);
    let employeeID = parseInt(data.idEmployee, 10);
    let customerID = parseInt(data.idCustomer, 10);
    let minutesToProcess = parseFloat(data.minutesToProcess);
    let orderDate = data.orderDate?.trim();

    // Validate the incoming values
    if (
        Number.isNaN(orderID) ||
        Number.isNaN(employeeID) ||
        Number.isNaN(customerID) ||
        Number.isNaN(minutesToProcess) ||
        !orderDate
    ) {
        return res.status(400).json({
            error: "Valid Order, Employee, Customer, processing time, and date values are required."
        });
    }

    if (minutesToProcess < 0) {
        return res.status(400).json({
            error: "Processing time cannot be negative."
        });
    }

    // totalPrice is deliberately NOT updated here.
    //
    // It is calculated from Orders_Drinks and Drinks instead.
    let updateOrderQuery = `
        UPDATE Orders
        SET idEmployee = ?,
            idCustomer = ?,
            minutesToProcess = ?,
            orderDate = ?
        WHERE idOrder = ?
    `;

    db.pool.query(
        updateOrderQuery,
        [
            employeeID,
            customerID,
            minutesToProcess,
            orderDate,
            orderID
        ],
        function (error, result, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(400);
            }

            // Retrieve the actual updated Order from MariaDB
            let selectOrderQuery = `
                SELECT
                    idOrder,
                    idEmployee,
                    idCustomer,
                    totalPrice,
                    minutesToProcess,
                    DATE_FORMAT(orderDate, '%Y-%m-%d') AS orderDate
                FROM Orders
                WHERE idOrder = ?
            `;

            db.pool.query(
                selectOrderQuery,
                [orderID],
                function (error, rows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    if (rows.length === 0) {
                        return res.sendStatus(404);
                    }

                    let updatedOrder = rows[0];

                    res.status(200).json(updatedOrder);
                }
            );
        }
    );
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS_DRINKS PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ----------------------------------------------------
// ORDERS_DRINKS ROUTES
// ----------------------------------------------------


// READ: Display all Order-Drink relationships
app.get('/orders_drinks', function (req, res) {

    // Get all Order-Drink relationships
    let orderDrinkQuery = `
        SELECT
            Orders_Drinks.idOrderDrink,
            Orders_Drinks.idOrder,
            Orders_Drinks.idDrink,
            Drinks.name AS drinkName,
            Orders_Drinks.quantity,
            Orders_Drinks.drinkTotal
        FROM Orders_Drinks
        INNER JOIN Drinks
            ON Orders_Drinks.idDrink = Drinks.idDrink
        ORDER BY Orders_Drinks.idOrderDrink;
    `;

    // Get Orders for the dropdowns
    let orderQuery = `
        SELECT idOrder
        FROM Orders
        ORDER BY idOrder;
    `;

    // Get Drinks for the dropdowns
    let drinkQuery = `
        SELECT idDrink, name, price
        FROM Drinks
        ORDER BY idDrink;
    `;

    db.pool.query(
        orderDrinkQuery,
        function (error, orderDrinkRows, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            db.pool.query(
                orderQuery,
                function (error, orderRows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    db.pool.query(
                        drinkQuery,
                        function (error, drinkRows, fields) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(500);
                            }

                            res.render('orders_drinks', {
                                orderDrinkData: orderDrinkRows,
                                orderData: orderRows,
                                drinkData: drinkRows
                            });
                        }
                    );
                }
            );
        }
    );
});


// CREATE: Add a Drink to an Order
app.post('/add-order_drink-ajax', function (req, res) {

    let data = req.body;

    let orderID = parseInt(data.idOrder, 10);
    let drinkID = parseInt(data.idDrink, 10);
    let quantity = parseInt(data.quantity, 10);

    // Validate incoming values
    if (
        Number.isNaN(orderID) ||
        Number.isNaN(drinkID) ||
        Number.isNaN(quantity) ||
        quantity <= 0
    ) {
        return res.status(400).json({
            error: "A valid Order, Drink, and quantity greater than zero are required."
        });
    }


    // STEP 1:
    // Get the Drink's current price from MariaDB.
    //
    // The browser does NOT tell us what the Drink costs.
    // The database is the authoritative source for price.
    let selectDrinkQuery = `
        SELECT price
        FROM Drinks
        WHERE idDrink = ?
    `;

    db.pool.query(
        selectDrinkQuery,
        [drinkID],
        function (error, drinkRows, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            if (drinkRows.length === 0) {
                return res.status(404).json({
                    error: "Drink not found."
                });
            }

            let drinkPrice = parseFloat(drinkRows[0].price);

            // Calculate this line item's total
            let drinkTotal = drinkPrice * quantity;


            // STEP 2:
            // Add the Drink to the Order.
            let insertOrderDrinkQuery = `
                INSERT INTO Orders_Drinks
                    (idOrder, idDrink, quantity, drinkTotal)
                VALUES (?, ?, ?, ?)
            `;

            db.pool.query(
                insertOrderDrinkQuery,
                [
                    orderID,
                    drinkID,
                    quantity,
                    drinkTotal
                ],
                function (error, result, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(400);
                    }

                    let newOrderDrinkID = result.insertId;


                    // STEP 3:
                    // Recalculate the entire Order's total price.
                    recalculateOrderTotal(
                        orderID,
                        function (error, result) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(500);
                            }


                            // STEP 4:
                            // Read the actual newly-created row
                            // back from MariaDB.
                            let selectOrderDrinkQuery = `
                                SELECT
                                    Orders_Drinks.idOrderDrink,
                                    Orders_Drinks.idOrder,
                                    Orders_Drinks.idDrink,
                                    Drinks.name AS drinkName,
                                    Orders_Drinks.quantity,
                                    Orders_Drinks.drinkTotal
                                FROM Orders_Drinks
                                INNER JOIN Drinks
                                    ON Orders_Drinks.idDrink = Drinks.idDrink
                                WHERE Orders_Drinks.idOrderDrink = ?
                            `;

                            db.pool.query(
                                selectOrderDrinkQuery,
                                [newOrderDrinkID],
                                function (error, rows, fields) {

                                    if (error) {
                                        console.log(error);
                                        return res.sendStatus(500);
                                    }

                                    let newOrderDrink = rows[0];

                                    res.status(201).json(newOrderDrink);
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});


// DELETE: Remove a Drink from an Order
app.delete('/delete-order_drink-ajax', function (req, res) {

    let data = req.body;

    let orderDrinkID = parseInt(data.id, 10);

    if (Number.isNaN(orderDrinkID)) {
        return res.status(400).json({
            error: "A valid Order-Drink ID is required."
        });
    }


    // STEP 1:
    // Find the Order this line item belongs to.
    //
    // We need the idOrder because after deleting the line item,
    // we need to recalculate that Order's total price.
    let selectOrderDrinkQuery = `
        SELECT idOrder
        FROM Orders_Drinks
        WHERE idOrderDrink = ?
    `;

    db.pool.query(
        selectOrderDrinkQuery,
        [orderDrinkID],
        function (error, rows, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            if (rows.length === 0) {
                return res.sendStatus(404);
            }

            let orderID = rows[0].idOrder;


            // STEP 2:
            // Delete the Order-Drink relationship.
            let deleteOrderDrinkQuery = `
                DELETE FROM Orders_Drinks
                WHERE idOrderDrink = ?
            `;

            db.pool.query(
                deleteOrderDrinkQuery,
                [orderDrinkID],
                function (error, result, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(400);
                    }


                    // STEP 3:
                    // Recalculate the Order's total now that
                    // one Drink line item has been removed.
                    recalculateOrderTotal(
                        orderID,
                        function (error, result) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(500);
                            }

                            res.sendStatus(204);
                        }
                    );
                }
            );
        }
    );
});


// UPDATE: Update a Drink belonging to an Order
app.put('/put-order_drink-ajax', function (req, res) {

    let data = req.body;

    let orderDrinkID = parseInt(data.id, 10);
    let newOrderID = parseInt(data.idOrder, 10);
    let drinkID = parseInt(data.idDrink, 10);
    let quantity = parseInt(data.quantity, 10);

    if (
        Number.isNaN(orderDrinkID) ||
        Number.isNaN(newOrderID) ||
        Number.isNaN(drinkID) ||
        Number.isNaN(quantity) ||
        quantity <= 0
    ) {
        return res.status(400).json({
            error: "Valid Order-Drink, Order, Drink, and quantity values are required."
        });
    }


    // STEP 1:
    // Find the original Order.
    //
    // If the user moves this line item to another Order,
    // BOTH Order totals need to be recalculated.
    let selectOriginalOrderQuery = `
        SELECT idOrder
        FROM Orders_Drinks
        WHERE idOrderDrink = ?
    `;

    db.pool.query(
        selectOriginalOrderQuery,
        [orderDrinkID],
        function (error, orderDrinkRows, fields) {

            if (error) {
                console.log(error);
                return res.sendStatus(500);
            }

            if (orderDrinkRows.length === 0) {
                return res.sendStatus(404);
            }

            let oldOrderID = orderDrinkRows[0].idOrder;


            // STEP 2:
            // Get the current Drink price.
            let selectDrinkQuery = `
                SELECT price
                FROM Drinks
                WHERE idDrink = ?
            `;

            db.pool.query(
                selectDrinkQuery,
                [drinkID],
                function (error, drinkRows, fields) {

                    if (error) {
                        console.log(error);
                        return res.sendStatus(500);
                    }

                    if (drinkRows.length === 0) {
                        return res.sendStatus(404);
                    }

                    let drinkPrice = parseFloat(
                        drinkRows[0].price
                    );

                    let drinkTotal =
                        drinkPrice * quantity;


                    // STEP 3:
                    // Update the Order-Drink relationship.
                    let updateOrderDrinkQuery = `
                        UPDATE Orders_Drinks
                        SET idOrder = ?,
                            idDrink = ?,
                            quantity = ?,
                            drinkTotal = ?
                        WHERE idOrderDrink = ?
                    `;

                    db.pool.query(
                        updateOrderDrinkQuery,
                        [
                            newOrderID,
                            drinkID,
                            quantity,
                            drinkTotal,
                            orderDrinkID
                        ],
                        function (error, result, fields) {

                            if (error) {
                                console.log(error);
                                return res.sendStatus(400);
                            }


                            // STEP 4:
                            // Recalculate the original Order.
                            recalculateOrderTotal(
                                oldOrderID,
                                function (error, result) {

                                    if (error) {
                                        console.log(error);
                                        return res.sendStatus(500);
                                    }


                                    // STEP 5:
                                    // If this line item was moved to
                                    // another Order, recalculate that
                                    // Order as well.
                                    function finishUpdate() {

                                        let selectUpdatedQuery = `
                                            SELECT
                                                Orders_Drinks.idOrderDrink,
                                                Orders_Drinks.idOrder,
                                                Orders_Drinks.idDrink,
                                                Drinks.name AS drinkName,
                                                Orders_Drinks.quantity,
                                                Orders_Drinks.drinkTotal
                                            FROM Orders_Drinks
                                            INNER JOIN Drinks
                                                ON Orders_Drinks.idDrink = Drinks.idDrink
                                            WHERE Orders_Drinks.idOrderDrink = ?
                                        `;

                                        db.pool.query(
                                            selectUpdatedQuery,
                                            [orderDrinkID],
                                            function (error, rows, fields) {

                                                if (error) {
                                                    console.log(error);
                                                    return res.sendStatus(500);
                                                }

                                                let updatedOrderDrink =
                                                    rows[0];

                                                res.status(200).json(
                                                    updatedOrderDrink
                                                );
                                            }
                                        );
                                    }


                                    if (newOrderID !== oldOrderID) {

                                        recalculateOrderTotal(
                                            newOrderID,
                                            function (error, result) {

                                                if (error) {
                                                    console.log(error);
                                                    return res.sendStatus(500);
                                                }

                                                finishUpdate();
                                            }
                                        );

                                    } else {

                                        finishUpdate();
                                    }
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS-DRINKS PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







/////////////// HELPER FUNCTIONS /////////////////////////////////////////////////////////////////////////////////////////////////////////

// ----------------------------------------------------
// ORDER TOTAL HELPER
// ----------------------------------------------------


// Recalculate an Order's total price based on the Drinks
// currently associated with that Order.
//
// totalPrice = SUM(Drink price * quantity)
function recalculateOrderTotal(orderID, callback) {

    let query = `
        UPDATE Orders
        SET totalPrice = (
            SELECT COALESCE(
                SUM(Orders_Drinks.quantity * Drinks.price),
                0
            )
            FROM Orders_Drinks
            INNER JOIN Drinks
                ON Orders_Drinks.idDrink = Drinks.idDrink
            WHERE Orders_Drinks.idOrder = ?
        )
        WHERE idOrder = ?
    `;

    db.pool.query(
        query,
        [orderID, orderID],
        function (error, result, fields) {

            callback(error, result);
        }
    );
}


/*
    LISTENER
*/
app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});