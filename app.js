/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The basis of the following starter code was adapted from the course's nodejs-start-app repository, specifically following step 3
// source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
    SETUP
*/

require('dotenv').config();

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 26801;


// Serve static files from the "public" directory.
app.use(express.static(path.join(__dirname, 'public')));


// Configure Handlebars.
//
// views/layouts/main.hbs is the shared layout for every rendered page.
//
// The contents of:
//
// index.hbs
// employees.hbs
// customers.hbs
// orders.hbs
// drinks.hbs
// orders_drinks.hbs
//
// are inserted into {{{body}}} inside main.hbs.
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));


// Tell Express to use Handlebars.
app.set('view engine', '.hbs');


// Tell Express where our views are located.
app.set('views', path.join(__dirname, 'views'));


// Database
const db = require('./database/db-connector');


// Middleware for parsing JSON and URL-encoded request bodies.
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   HOME PAGE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/', function (req, res) {

    // index.hbs only contains homepage-specific content.
    //
    // main.hbs provides:
    //
    // <html>
    // <head>
    // <title>
    // navigation
    // <main>
    // footer
    //
    // index.hbs is inserted into {{{body}}}.

    res.render('index', {
        pageTitle: 'Home'
    });

});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   CUSTOMERS PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ----------------------------------------------------
// READ: Display all Customers
// ----------------------------------------------------

app.get('/customers', function (req, res) {

    let query = `
        SELECT *
        FROM Customers;
    `;


    db.pool.query(
        query,
        function (error, rows, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(500);

            }


            res.render('customers', {

                pageTitle: 'Customers',

                data: rows

            });

        }
    );

});



// ----------------------------------------------------
// CREATE: Add a new Customer
// ----------------------------------------------------

app.post('/add-customer-ajax', function (req, res) {

    let data = req.body;


    let name =
        data.name?.trim();

    let phoneNum =
        data.phoneNum?.trim() || null;

    let email =
        data.email?.trim() || null;


    // Customer name is required.
    if (!name) {

        return res.status(400).json({
            error: 'Customer name is required.'
        });

    }


    let insertCustomerQuery = `
        INSERT INTO Customers
            (name, phoneNum, email)
        VALUES (?, ?, ?)
    `;


    db.pool.query(

        insertCustomerQuery,

        [
            name,
            phoneNum,
            email
        ],

        function (error, result, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(400);

            }


            // MariaDB created the idCustomer.
            let newCustomerID =
                result.insertId;


            // Read the actual stored Customer
            // back from MariaDB.
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


                    let newCustomer =
                        rows[0];


                    res
                        .status(201)
                        .json(newCustomer);

                }

            );

        }

    );

});



// ----------------------------------------------------
// DELETE: Delete a Customer
// ----------------------------------------------------

app.delete('/delete-customer-ajax', function (req, res) {

    let data =
        req.body;


    let customerID =
        parseInt(data.id, 10);


    if (Number.isNaN(customerID)) {

        return res.status(400).json({
            error: 'A valid customer ID is required.'
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


            if (result.affectedRows === 0) {

                return res.sendStatus(404);

            }


            // Success with no response body.
            res.sendStatus(204);

        }

    );

});



// ----------------------------------------------------
// UPDATE: Update a Customer
// ----------------------------------------------------

app.put('/put-customer-ajax', function (req, res) {

    let data =
        req.body;


    let customerID =
        parseInt(data.id, 10);


    let name =
        data.name?.trim();

    let phoneNum =
        data.phoneNum?.trim() || null;

    let email =
        data.email?.trim() || null;


    if (Number.isNaN(customerID)) {

        return res.status(400).json({
            error: 'A valid customer ID is required.'
        });

    }


    if (!name) {

        return res.status(400).json({
            error: 'Customer name is required.'
        });

    }


    let updateCustomerQuery = `
        UPDATE Customers
        SET
            name = ?,
            phoneNum = ?,
            email = ?
        WHERE idCustomer = ?
    `;


    db.pool.query(

        updateCustomerQuery,

        [
            name,
            phoneNum,
            email,
            customerID
        ],

        function (error, result, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(400);

            }


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


                    if (rows.length === 0) {

                        return res.sendStatus(404);

                    }


                    let updatedCustomer =
                        rows[0];


                    res
                        .status(200)
                        .json(updatedCustomer);

                }

            );

        }

    );

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   CUSTOMERS PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   DRINKS PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ----------------------------------------------------
// READ: Display all Drinks
// ----------------------------------------------------

app.get('/drinks', function (req, res) {

    let query = `
        SELECT *
        FROM Drinks;
    `;


    db.pool.query(
        query,
        function (error, rows, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(500);

            }


            res.render('drinks', {

                pageTitle: 'Drinks',

                data: rows

            });

        }
    );

});



// ----------------------------------------------------
// CREATE: Add a new Drink
// ----------------------------------------------------

app.post('/add-drink-ajax', function (req, res) {

    let data =
        req.body;


    let name =
        data.name?.trim();

    let description =
        data.description?.trim();

    let price =
        parseFloat(data.price);


    if (
        !name ||
        !description ||
        Number.isNaN(price)
    ) {

        return res.status(400).json({
            error:
                'Name, description, and a valid price are required.'
        });

    }


    if (price < 0) {

        return res.status(400).json({
            error:
                'Price cannot be negative.'
        });

    }


    let insertDrinkQuery = `
        INSERT INTO Drinks
            (name, description, price)
        VALUES (?, ?, ?)
    `;


    db.pool.query(

        insertDrinkQuery,

        [
            name,
            description,
            price
        ],

        function (error, result, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(400);

            }


            let newDrinkID =
                result.insertId;


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


                    let newDrink =
                        rows[0];


                    res
                        .status(201)
                        .json(newDrink);

                }

            );

        }

    );

});



// ----------------------------------------------------
// DELETE: Delete a Drink
// ----------------------------------------------------

app.delete('/delete-drink-ajax', function (req, res) {

    let data =
        req.body;


    let drinkID =
        parseInt(data.id, 10);


    if (Number.isNaN(drinkID)) {

        return res.status(400).json({
            error:
                'A valid drink ID is required.'
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


            if (result.affectedRows === 0) {

                return res.sendStatus(404);

            }


            res.sendStatus(204);

        }

    );

});



// ----------------------------------------------------
// UPDATE: Update a Drink
// ----------------------------------------------------

app.put('/put-drink-ajax', function (req, res) {

    let data =
        req.body;


    let drinkID =
        parseInt(data.id, 10);


    let name =
        data.name?.trim();

    let description =
        data.description?.trim();

    let price =
        parseFloat(data.price);


    if (Number.isNaN(drinkID)) {

        return res.status(400).json({
            error:
                'A valid drink ID is required.'
        });

    }


    if (
        !name ||
        !description ||
        Number.isNaN(price)
    ) {

        return res.status(400).json({
            error:
                'Name, description, and a valid price are required.'
        });

    }


    if (price < 0) {

        return res.status(400).json({
            error:
                'Price cannot be negative.'
        });

    }


    let updateDrinkQuery = `
        UPDATE Drinks
        SET
            name = ?,
            description = ?,
            price = ?
        WHERE idDrink = ?
    `;


    db.pool.query(

        updateDrinkQuery,

        [
            name,
            description,
            price,
            drinkID
        ],

        function (error, result, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(400);

            }


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


                    if (rows.length === 0) {

                        return res.sendStatus(404);

                    }


                    let updatedDrink =
                        rows[0];


                    res
                        .status(200)
                        .json(updatedDrink);

                }

            );

        }

    );

});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   DRINKS PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   EMPLOYEES PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ----------------------------------------------------
// READ: Display all Employees
// ----------------------------------------------------

app.get('/employees', function (req, res) {

    let query = `
        SELECT *
        FROM Employees;
    `;


    db.pool.query(
        query,
        function (error, rows, fields) {

            if (error) {

                console.log(error);

                return res.sendStatus(500);

            }


            res.render('employees', {

                pageTitle: 'Employees',

                data: rows

            });

        }
    );

});



// ----------------------------------------------------
// CREATE: Add a new Employee
// ----------------------------------------------------

app.post('/add-employee-ajax', function (req, res) {

    let data =
        req.body;


    let name =
        data.name?.trim();

    let password =
        data.password?.trim();

    let phoneNum =
        data.phoneNum?.trim();

    let email =
        data.email?.trim();

    let address =
        data.address?.trim();


    if (
        !name ||
        !password ||
        !phoneNum ||
        !email ||
        !address
    ) {

        return res.status(400).json({
            error:
                'All employee fields are required.'
        });

    }


    // STEP 1:
    // Create the Password row first.

    let insertPasswordQuery = `
        INSERT INTO Passwords
            (password)
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


            let newPasswordID =
                passwordResult.insertId;


            // STEP 2:
            // Create the Employee using
            // the new Password ID.

            let insertEmployeeQuery = `
                INSERT INTO Employees
                    (
                        name,
                        idPassword,
                        phoneNum,
                        email,
                        address
                    )
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

                function (
                    error,
                    employeeResult,
                    fields
                ) {

                    if (error) {

                        console.log(error);


                        // The Password was created,
                        // but Employee creation failed.
                        //
                        // Delete the unused Password row.

                        let cleanupPasswordQuery = `
                            DELETE FROM Passwords
                            WHERE idPassword = ?
                        `;


                        return db.pool.query(

                            cleanupPasswordQuery,

                            [newPasswordID],

                            function (cleanupError) {

                                if (cleanupError) {

                                    console.log(
                                        cleanupError
                                    );

                                }


                                return res.sendStatus(
                                    400
                                );

                            }

                        );

                    }


                    let newEmployeeID =
                        employeeResult.insertId;


                    // STEP 3:
                    // Read the actual Employee
                    // back from MariaDB.

                    let selectEmployeeQuery = `
                        SELECT *
                        FROM Employees
                        WHERE idEmployee = ?
                    `;


                    db.pool.query(

                        selectEmployeeQuery,

                        [newEmployeeID],

                        function (
                            error,
                            rows,
                            fields
                        ) {

                            if (error) {

                                console.log(error);

                                return res.sendStatus(
                                    500
                                );

                            }


                            let newEmployee =
                                rows[0];


                            res
                                .status(201)
                                .json(
                                    newEmployee
                                );

                        }

                    );

                }

            );

        }

    );

});



// ----------------------------------------------------
// DELETE: Delete an Employee
// ----------------------------------------------------

app.delete(
    '/delete-employee-ajax',
    function (req, res) {

        let data =
            req.body;


        let employeeID =
            parseInt(data.id, 10);


        if (
            Number.isNaN(employeeID)
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'A valid employee ID is required.'
                });

        }


        // STEP 1:
        // Find the Employee's Password ID
        // before deleting the Employee.

        let selectEmployeeQuery = `
            SELECT idPassword
            FROM Employees
            WHERE idEmployee = ?
        `;


        db.pool.query(

            selectEmployeeQuery,

            [employeeID],

            function (
                error,
                rows,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res.sendStatus(
                        500
                    );

                }


                if (
                    rows.length === 0
                ) {

                    return res.sendStatus(
                        404
                    );

                }


                let passwordID =
                    rows[0].idPassword;


                // STEP 2:
                // Delete the Employee.
                //
                // Orders.idEmployee uses
                // ON DELETE SET NULL,
                // so Orders remain.

                let deleteEmployeeQuery = `
                    DELETE FROM Employees
                    WHERE idEmployee = ?
                `;


                db.pool.query(

                    deleteEmployeeQuery,

                    [employeeID],

                    function (
                        error,
                        result,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    400
                                );

                        }


                        // STEP 3:
                        // Delete the Password
                        // if nothing else
                        // references it.

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

                            [
                                passwordID,
                                passwordID
                            ],

                            function (
                                error,
                                result,
                                fields
                            ) {

                                if (error) {

                                    console.log(
                                        error
                                    );

                                    return res
                                        .sendStatus(
                                            500
                                        );

                                }


                                res.sendStatus(
                                    204
                                );

                            }

                        );

                    }

                );

            }

        );

    }
);



// ----------------------------------------------------
// UPDATE: Update an Employee
// ----------------------------------------------------

app.put(
    '/put-employee-ajax',
    function (req, res) {

        let data =
            req.body;


        let employeeID =
            parseInt(
                data.id,
                10
            );


        let name =
            data.name?.trim();

        let phoneNum =
            data.phoneNum?.trim();

        let email =
            data.email?.trim();

        let address =
            data.address?.trim();


        if (
            Number.isNaN(employeeID)
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'A valid employee ID is required.'
                });

        }


        if (
            !name ||
            !phoneNum ||
            !email ||
            !address
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'Name, phone number, email, and address are required.'
                });

        }


        let updateEmployeeQuery = `
            UPDATE Employees
            SET
                name = ?,
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

            function (
                error,
                result,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            400
                        );

                }


                let selectEmployeeQuery = `
                    SELECT *
                    FROM Employees
                    WHERE idEmployee = ?
                `;


                db.pool.query(

                    selectEmployeeQuery,

                    [employeeID],

                    function (
                        error,
                        rows,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    500
                                );

                        }


                        if (
                            rows.length === 0
                        ) {

                            return res
                                .sendStatus(
                                    404
                                );

                        }


                        let updatedEmployee =
                            rows[0];


                        res
                            .status(200)
                            .json(
                                updatedEmployee
                            );

                    }

                );

            }

        );

    }
);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   EMPLOYEES PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ----------------------------------------------------
// READ: Display all Orders
// ----------------------------------------------------

app.get('/orders', function (req, res) {

    let orderQuery = `
        SELECT
            idOrder,
            idEmployee,
            idCustomer,
            totalPrice,
            minutesToProcess,
            DATE_FORMAT(
                orderDate,
                '%Y-%m-%d'
            ) AS orderDate
        FROM Orders;
    `;


    // Customer information for dropdowns.
    let customerQuery = `
        SELECT
            idCustomer,
            name
        FROM Customers;
    `;


    // Employee information for dropdowns.
    let employeeQuery = `
        SELECT
            idEmployee,
            name
        FROM Employees;
    `;


    db.pool.query(

        orderQuery,

        function (
            error,
            orderRows,
            fields
        ) {

            if (error) {

                console.log(error);

                return res.sendStatus(
                    500
                );

            }


            db.pool.query(

                customerQuery,

                function (
                    error,
                    customerRows,
                    fields
                ) {

                    if (error) {

                        console.log(
                            error
                        );

                        return res
                            .sendStatus(
                                500
                            );

                    }


                    db.pool.query(

                        employeeQuery,

                        function (
                            error,
                            employeeRows,
                            fields
                        ) {

                            if (error) {

                                console.log(
                                    error
                                );

                                return res
                                    .sendStatus(
                                        500
                                    );

                            }


                            res.render(
                                'orders',
                                {

                                    pageTitle:
                                        'Orders',

                                    orderData:
                                        orderRows,

                                    customerData:
                                        customerRows,

                                    employeeData:
                                        employeeRows

                                }
                            );

                        }

                    );

                }

            );

        }

    );

});



// ----------------------------------------------------
// CREATE: Add a new Order
// ----------------------------------------------------

app.post(
    '/add-order-ajax',
    function (req, res) {

        let data =
            req.body;


        let employeeID =
            parseInt(
                data.idEmployee,
                10
            );

        let customerID =
            parseInt(
                data.idCustomer,
                10
            );

        let minutesToProcess =
            parseFloat(
                data.minutesToProcess
            );

        let orderDate =
            data.orderDate?.trim();


        if (
            Number.isNaN(
                employeeID
            ) ||
            Number.isNaN(
                customerID
            ) ||
            Number.isNaN(
                minutesToProcess
            ) ||
            !orderDate
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'Employee, customer, processing time, and order date are required.'
                });

        }


        if (
            minutesToProcess < 0
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'Processing time cannot be negative.'
                });

        }


        /*
            totalPrice is not supplied here.

            MariaDB initializes totalPrice
            to 0.00 because a new Order
            has no line items yet.
        */

        let insertOrderQuery = `
            INSERT INTO Orders
                (
                    idEmployee,
                    idCustomer,
                    minutesToProcess,
                    orderDate
                )
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

            function (
                error,
                result,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            400
                        );

                }


                let newOrderID =
                    result.insertId;


                let selectOrderQuery = `
                    SELECT
                        idOrder,
                        idEmployee,
                        idCustomer,
                        totalPrice,
                        minutesToProcess,
                        DATE_FORMAT(
                            orderDate,
                            '%Y-%m-%d'
                        ) AS orderDate
                    FROM Orders
                    WHERE idOrder = ?
                `;


                db.pool.query(

                    selectOrderQuery,

                    [newOrderID],

                    function (
                        error,
                        rows,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    500
                                );

                        }


                        let newOrder =
                            rows[0];


                        res
                            .status(201)
                            .json(
                                newOrder
                            );

                    }

                );

            }

        );

    }
);



// ----------------------------------------------------
// DELETE: Delete an Order
// ----------------------------------------------------

app.delete(
    '/delete-order-ajax',
    function (req, res) {

        let data =
            req.body;


        let orderID =
            parseInt(
                data.id,
                10
            );


        if (
            Number.isNaN(
                orderID
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'A valid order ID is required.'
                });

        }


        let deleteOrderQuery = `
            DELETE FROM Orders
            WHERE idOrder = ?
        `;


        db.pool.query(

            deleteOrderQuery,

            [orderID],

            function (
                error,
                result,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            400
                        );

                }


                if (
                    result
                        .affectedRows === 0
                ) {

                    return res
                        .sendStatus(
                            404
                        );

                }


                /*
                    Orders_Drinks uses
                    ON DELETE CASCADE.

                    Therefore, deleting
                    an Order also deletes
                    its Order Items.
                */

                res.sendStatus(204);

            }

        );

    }
);



// ----------------------------------------------------
// UPDATE: Update an Order
// ----------------------------------------------------

app.put(
    '/put-order-ajax',
    function (req, res) {

        let data =
            req.body;


        let orderID =
            parseInt(
                data.id,
                10
            );

        let employeeID =
            parseInt(
                data.idEmployee,
                10
            );

        let customerID =
            parseInt(
                data.idCustomer,
                10
            );

        let minutesToProcess =
            parseFloat(
                data.minutesToProcess
            );

        let orderDate =
            data.orderDate?.trim();


        if (
            Number.isNaN(orderID) ||
            Number.isNaN(employeeID) ||
            Number.isNaN(customerID) ||
            Number.isNaN(
                minutesToProcess
            ) ||
            !orderDate
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'Valid Order, Employee, Customer, processing time, and date values are required.'
                });

        }


        if (
            minutesToProcess < 0
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'Processing time cannot be negative.'
                });

        }


        /*
            totalPrice is intentionally
            not changed here.

            It is derived from
            Orders_Drinks.
        */

        let updateOrderQuery = `
            UPDATE Orders
            SET
                idEmployee = ?,
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

            function (
                error,
                result,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            400
                        );

                }


                let selectOrderQuery = `
                    SELECT
                        idOrder,
                        idEmployee,
                        idCustomer,
                        totalPrice,
                        minutesToProcess,
                        DATE_FORMAT(
                            orderDate,
                            '%Y-%m-%d'
                        ) AS orderDate
                    FROM Orders
                    WHERE idOrder = ?
                `;


                db.pool.query(

                    selectOrderQuery,

                    [orderID],

                    function (
                        error,
                        rows,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    500
                                );

                        }


                        if (
                            rows.length === 0
                        ) {

                            return res
                                .sendStatus(
                                    404
                                );

                        }


                        let updatedOrder =
                            rows[0];


                        res
                            .status(200)
                            .json(
                                updatedOrder
                            );

                    }

                );

            }

        );

    }
);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS_DRINKS / ORDER ITEMS PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ----------------------------------------------------
// READ: Display all Order Items
// ----------------------------------------------------

app.get(
    '/orders_drinks',
    function (req, res) {

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
                ON Orders_Drinks.idDrink
                = Drinks.idDrink

            ORDER BY
                Orders_Drinks.idOrderDrink;
        `;


        let orderQuery = `
            SELECT idOrder
            FROM Orders
            ORDER BY idOrder;
        `;


        let drinkQuery = `
            SELECT
                idDrink,
                name,
                price
            FROM Drinks
            ORDER BY idDrink;
        `;


        db.pool.query(

            orderDrinkQuery,

            function (
                error,
                orderDrinkRows,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            500
                        );

                }


                db.pool.query(

                    orderQuery,

                    function (
                        error,
                        orderRows,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    500
                                );

                        }


                        db.pool.query(

                            drinkQuery,

                            function (
                                error,
                                drinkRows,
                                fields
                            ) {

                                if (error) {

                                    console.log(
                                        error
                                    );

                                    return res
                                        .sendStatus(
                                            500
                                        );

                                }


                                /*
                                    Internally:

                                    /orders_drinks
                                    orders_drinks.hbs
                                    Orders_Drinks

                                    User-facing name:

                                    Order Items
                                */

                                res.render(
                                    'orders_drinks',
                                    {

                                        pageTitle:
                                            'Order Items',

                                        orderDrinkData:
                                            orderDrinkRows,

                                        orderData:
                                            orderRows,

                                        drinkData:
                                            drinkRows

                                    }
                                );

                            }

                        );

                    }

                );

            }

        );

    }
);



// ----------------------------------------------------
// CREATE: Add a Drink line item to an Order
// ----------------------------------------------------

app.post(
    '/add-order_drink-ajax',
    function (req, res) {

        let data =
            req.body;


        let orderID =
            parseInt(
                data.idOrder,
                10
            );

        let drinkID =
            parseInt(
                data.idDrink,
                10
            );

        let quantity =
            parseInt(
                data.quantity,
                10
            );


        if (
            Number.isNaN(orderID) ||
            Number.isNaN(drinkID) ||
            Number.isNaN(quantity) ||
            quantity <= 0
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'A valid Order, Drink, and quantity greater than zero are required.'
                });

        }


        // STEP 1:
        // Get the Drink's current price
        // directly from MariaDB.

        let selectDrinkQuery = `
            SELECT price
            FROM Drinks
            WHERE idDrink = ?
        `;


        db.pool.query(

            selectDrinkQuery,

            [drinkID],

            function (
                error,
                drinkRows,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            500
                        );

                }


                if (
                    drinkRows.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            error:
                                'Drink not found.'
                        });

                }


                let drinkPrice =
                    parseFloat(
                        drinkRows[0]
                            .price
                    );


                let drinkTotal =
                    drinkPrice *
                    quantity;


                // STEP 2:
                // Insert the Order Item.

                let insertOrderDrinkQuery = `
                    INSERT INTO Orders_Drinks
                        (
                            idOrder,
                            idDrink,
                            quantity,
                            drinkTotal
                        )
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

                    function (
                        error,
                        result,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    400
                                );

                        }


                        let newOrderDrinkID =
                            result.insertId;


                        // STEP 3:
                        // Recalculate the
                        // parent Order total.

                        recalculateOrderTotal(

                            orderID,

                            function (
                                error,
                                result
                            ) {

                                if (
                                    error
                                ) {

                                    console.log(
                                        error
                                    );

                                    return res
                                        .sendStatus(
                                            500
                                        );

                                }


                                // STEP 4:
                                // Read the new
                                // line item back.

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
                                        ON Orders_Drinks.idDrink
                                        = Drinks.idDrink

                                    WHERE
                                        Orders_Drinks.idOrderDrink = ?
                                `;


                                db.pool.query(

                                    selectOrderDrinkQuery,

                                    [
                                        newOrderDrinkID
                                    ],

                                    function (
                                        error,
                                        rows,
                                        fields
                                    ) {

                                        if (
                                            error
                                        ) {

                                            console.log(
                                                error
                                            );

                                            return res
                                                .sendStatus(
                                                    500
                                                );

                                        }


                                        let newOrderDrink =
                                            rows[0];


                                        res
                                            .status(
                                                201
                                            )
                                            .json(
                                                newOrderDrink
                                            );

                                    }

                                );

                            }

                        );

                    }

                );

            }

        );

    }
);



// ----------------------------------------------------
// DELETE: Remove a Drink line item from an Order
// ----------------------------------------------------

app.delete(
    '/delete-order_drink-ajax',
    function (req, res) {

        let data =
            req.body;


        let orderDrinkID =
            parseInt(
                data.id,
                10
            );


        if (
            Number.isNaN(
                orderDrinkID
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'A valid Order-Drink ID is required.'
                });

        }


        // STEP 1:
        // Find the parent Order
        // before deleting the line item.

        let selectOrderDrinkQuery = `
            SELECT idOrder
            FROM Orders_Drinks
            WHERE idOrderDrink = ?
        `;


        db.pool.query(

            selectOrderDrinkQuery,

            [orderDrinkID],

            function (
                error,
                rows,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            500
                        );

                }


                if (
                    rows.length === 0
                ) {

                    return res
                        .sendStatus(
                            404
                        );

                }


                let orderID =
                    rows[0].idOrder;


                // STEP 2:
                // Delete the line item.

                let deleteOrderDrinkQuery = `
                    DELETE FROM Orders_Drinks
                    WHERE idOrderDrink = ?
                `;


                db.pool.query(

                    deleteOrderDrinkQuery,

                    [orderDrinkID],

                    function (
                        error,
                        result,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    400
                                );

                        }


                        // STEP 3:
                        // Recalculate the
                        // parent Order total.

                        recalculateOrderTotal(

                            orderID,

                            function (
                                error,
                                result
                            ) {

                                if (
                                    error
                                ) {

                                    console.log(
                                        error
                                    );

                                    return res
                                        .sendStatus(
                                            500
                                        );

                                }


                                res.sendStatus(
                                    204
                                );

                            }

                        );

                    }

                );

            }

        );

    }
);



// ----------------------------------------------------
// UPDATE: Update an Order Item
// ----------------------------------------------------

app.put(
    '/put-order_drink-ajax',
    function (req, res) {

        let data =
            req.body;


        let orderDrinkID =
            parseInt(
                data.id,
                10
            );

        let newOrderID =
            parseInt(
                data.idOrder,
                10
            );

        let drinkID =
            parseInt(
                data.idDrink,
                10
            );

        let quantity =
            parseInt(
                data.quantity,
                10
            );


        if (
            Number.isNaN(
                orderDrinkID
            ) ||
            Number.isNaN(
                newOrderID
            ) ||
            Number.isNaN(
                drinkID
            ) ||
            Number.isNaN(
                quantity
            ) ||
            quantity <= 0
        ) {

            return res
                .status(400)
                .json({
                    error:
                        'Valid Order-Drink, Order, Drink, and quantity values are required.'
                });

        }


        // STEP 1:
        // Find the original parent Order.

        let selectOriginalOrderQuery = `
            SELECT idOrder
            FROM Orders_Drinks
            WHERE idOrderDrink = ?
        `;


        db.pool.query(

            selectOriginalOrderQuery,

            [orderDrinkID],

            function (
                error,
                orderDrinkRows,
                fields
            ) {

                if (error) {

                    console.log(error);

                    return res
                        .sendStatus(
                            500
                        );

                }


                if (
                    orderDrinkRows
                        .length === 0
                ) {

                    return res
                        .sendStatus(
                            404
                        );

                }


                let oldOrderID =
                    orderDrinkRows[0]
                        .idOrder;


                // STEP 2:
                // Get the selected Drink's
                // current menu price.

                let selectDrinkQuery = `
                    SELECT price
                    FROM Drinks
                    WHERE idDrink = ?
                `;


                db.pool.query(

                    selectDrinkQuery,

                    [drinkID],

                    function (
                        error,
                        drinkRows,
                        fields
                    ) {

                        if (error) {

                            console.log(
                                error
                            );

                            return res
                                .sendStatus(
                                    500
                                );

                        }


                        if (
                            drinkRows
                                .length === 0
                        ) {

                            return res
                                .sendStatus(
                                    404
                                );

                        }


                        let drinkPrice =
                            parseFloat(
                                drinkRows[0]
                                    .price
                            );


                        let drinkTotal =
                            drinkPrice *
                            quantity;


                        // STEP 3:
                        // Update the line item.

                        let updateOrderDrinkQuery = `
                            UPDATE Orders_Drinks
                            SET
                                idOrder = ?,
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

                            function (
                                error,
                                result,
                                fields
                            ) {

                                if (
                                    error
                                ) {

                                    console.log(
                                        error
                                    );

                                    return res
                                        .sendStatus(
                                            400
                                        );

                                }


                                // STEP 4:
                                // Recalculate the
                                // original parent Order.

                                recalculateOrderTotal(

                                    oldOrderID,

                                    function (
                                        error,
                                        result
                                    ) {

                                        if (
                                            error
                                        ) {

                                            console.log(
                                                error
                                            );

                                            return res
                                                .sendStatus(
                                                    500
                                                );

                                        }


                                        /*
                                            After totals are correct,
                                            read the updated line item
                                            back from MariaDB.
                                        */

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
                                                    ON Orders_Drinks.idDrink
                                                    = Drinks.idDrink

                                                WHERE
                                                    Orders_Drinks.idOrderDrink = ?
                                            `;


                                            db.pool.query(

                                                selectUpdatedQuery,

                                                [
                                                    orderDrinkID
                                                ],

                                                function (
                                                    error,
                                                    rows,
                                                    fields
                                                ) {

                                                    if (
                                                        error
                                                    ) {

                                                        console.log(
                                                            error
                                                        );

                                                        return res
                                                            .sendStatus(
                                                                500
                                                            );

                                                    }


                                                    let updatedOrderDrink =
                                                        rows[0];


                                                    res
                                                        .status(
                                                            200
                                                        )
                                                        .json(
                                                            updatedOrderDrink
                                                        );

                                                }

                                            );

                                        }


                                        /*
                                            If the line item moved
                                            from one Order to another,
                                            BOTH totals must be updated.
                                        */

                                        if (
                                            newOrderID !==
                                            oldOrderID
                                        ) {

                                            recalculateOrderTotal(

                                                newOrderID,

                                                function (
                                                    error,
                                                    result
                                                ) {

                                                    if (
                                                        error
                                                    ) {

                                                        console.log(
                                                            error
                                                        );

                                                        return res
                                                            .sendStatus(
                                                                500
                                                            );

                                                    }


                                                    finishUpdate();

                                                }

                                            );

                                        }

                                        else {

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

    }
);


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS_DRINKS / ORDER ITEMS PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// ----------------------------------------------------
// ORDER TOTAL HELPER
// ----------------------------------------------------
//
// Recalculate an Order's total price
// from the stored Order Item totals.
//
// totalPrice = SUM(Orders_Drinks.drinkTotal)
//
// We deliberately sum the stored
// drinkTotal values.
//
// We do NOT recalculate old Orders
// using Drinks.price.
//
// This means changing the current
// menu price of a Drink will not
// retroactively change old Orders.
// ----------------------------------------------------

function recalculateOrderTotal(
    orderID,
    callback
) {

    let query = `
        UPDATE Orders

        SET totalPrice = (

            SELECT COALESCE(

                SUM(
                    Orders_Drinks.drinkTotal
                ),

                0

            )

            FROM Orders_Drinks

            WHERE
                Orders_Drinks.idOrder = ?

        )

        WHERE idOrder = ?
    `;


    db.pool.query(

        query,

        [
            orderID,
            orderID
        ],

        function (
            error,
            result,
            fields
        ) {

            callback(
                error,
                result
            );

        }

    );

}



/*
    LISTENER
*/

app.listen(
    PORT,
    function () {

        console.log(
            'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
        );

    }
);