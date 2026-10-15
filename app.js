/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The basis of the following starter code was adapted from the course's
// nodejs-start-app repository.
//
// source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
//
// The project has since been substantially expanded and refactored,
// including a migration from MariaDB to PostgreSQL.
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
    SETUP
*/

require('dotenv').config();

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');

const db = require('./database/db-connector');

const app = express();

const PORT = process.env.PORT || 26801;


// Serve static files from the public directory locally.
app.use(express.static(path.join(__dirname, 'public')));


// Configure Handlebars.
app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


// Parse JSON and URL-encoded request bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SQL COLUMN LISTS
//
// PostgreSQL database identifiers use snake_case.
//
// The aliases below convert those database names back into the
// camelCase property names already expected by our Handlebars
// templates and browser-side JavaScript.
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const CUSTOMER_COLUMNS = `
    id_customer AS "idCustomer",
    name,
    phone_num AS "phoneNum",
    email
`;


const DRINK_COLUMNS = `
    id_drink AS "idDrink",
    name,
    description,
    price
`;


const EMPLOYEE_COLUMNS = `
    id_employee AS "idEmployee",
    id_password AS "idPassword",
    name,
    phone_num AS "phoneNum",
    email,
    address
`;


const ORDER_COLUMNS = `
    id_order AS "idOrder",
    id_employee AS "idEmployee",
    id_customer AS "idCustomer",
    total_price AS "totalPrice",
    minutes_to_process AS "minutesToProcess",
    TO_CHAR(order_date, 'YYYY-MM-DD') AS "orderDate"
`;


const ORDER_DRINK_COLUMNS = `
    od.id_order_drink AS "idOrderDrink",
    od.id_order AS "idOrder",
    od.id_drink AS "idDrink",
    d.name AS "drinkName",
    od.quantity,
    od.drink_total AS "drinkTotal"
`;



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HOME PAGE
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/', function (req, res) {

    res.render('index', {
        pageTitle: 'Home'
    });

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// CUSTOMERS
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ
app.get('/customers', async function (req, res) {

    try {

        const result = await db.pool.query(`
            SELECT ${CUSTOMER_COLUMNS}
            FROM customers
            ORDER BY id_customer;
        `);

        res.render('customers', {
            pageTitle: 'Customers',
            data: result.rows
        });

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    }

});


// CREATE
app.post('/add-customer-ajax', async function (req, res) {

    const data = req.body;

    const name = data.name?.trim();
    const phoneNum = data.phoneNum?.trim() || null;
    const email = data.email?.trim() || null;


    if (!name) {

        return res.status(400).json({
            error: 'Customer name is required.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                INSERT INTO customers (
                    name,
                    phone_num,
                    email
                )
                VALUES ($1, $2, $3)

                RETURNING
                    id_customer AS "idCustomer",
                    name,
                    phone_num AS "phoneNum",
                    email;
            `,
            [name, phoneNum, email]
        );


        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});


// DELETE
app.delete('/delete-customer-ajax', async function (req, res) {

    const customerID = parseInt(req.body.id, 10);


    if (Number.isNaN(customerID)) {

        return res.status(400).json({
            error: 'A valid customer ID is required.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                DELETE FROM customers
                WHERE id_customer = $1
                RETURNING id_customer;
            `,
            [customerID]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        res.sendStatus(204);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});


// UPDATE
app.put('/put-customer-ajax', async function (req, res) {

    const data = req.body;

    const customerID = parseInt(data.id, 10);

    const name = data.name?.trim();
    const phoneNum = data.phoneNum?.trim() || null;
    const email = data.email?.trim() || null;


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


    try {

        const result = await db.pool.query(
            `
                UPDATE customers

                SET name = $1,
                    phone_num = $2,
                    email = $3

                WHERE id_customer = $4

                RETURNING
                    id_customer AS "idCustomer",
                    name,
                    phone_num AS "phoneNum",
                    email;
            `,
            [name, phoneNum, email, customerID]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// DRINKS
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ
app.get('/drinks', async function (req, res) {

    try {

        const result = await db.pool.query(`
            SELECT ${DRINK_COLUMNS}
            FROM drinks
            ORDER BY id_drink;
        `);


        res.render('drinks', {
            pageTitle: 'Drinks',
            data: result.rows
        });

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    }

});


// CREATE
app.post('/add-drink-ajax', async function (req, res) {

    const data = req.body;

    const name = data.name?.trim();
    const description = data.description?.trim();
    const price = parseFloat(data.price);


    if (
        !name ||
        !description ||
        Number.isNaN(price)
    ) {

        return res.status(400).json({
            error: 'Name, description, and a valid price are required.'
        });

    }


    if (price < 0) {

        return res.status(400).json({
            error: 'Price cannot be negative.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                INSERT INTO drinks (
                    name,
                    description,
                    price
                )
                VALUES ($1, $2, $3)

                RETURNING
                    id_drink AS "idDrink",
                    name,
                    description,
                    price;
            `,
            [name, description, price]
        );


        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});


// DELETE
app.delete('/delete-drink-ajax', async function (req, res) {

    const drinkID = parseInt(req.body.id, 10);


    if (Number.isNaN(drinkID)) {

        return res.status(400).json({
            error: 'A valid drink ID is required.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                DELETE FROM drinks
                WHERE id_drink = $1
                RETURNING id_drink;
            `,
            [drinkID]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        res.sendStatus(204);

    } catch (error) {

        // A Drink referenced by orders_drinks cannot be deleted.
        console.error(error);
        res.sendStatus(400);

    }

});


// UPDATE
app.put('/put-drink-ajax', async function (req, res) {

    const data = req.body;

    const drinkID = parseInt(data.id, 10);

    const name = data.name?.trim();
    const description = data.description?.trim();
    const price = parseFloat(data.price);


    if (Number.isNaN(drinkID)) {

        return res.status(400).json({
            error: 'A valid drink ID is required.'
        });

    }


    if (
        !name ||
        !description ||
        Number.isNaN(price)
    ) {

        return res.status(400).json({
            error: 'Name, description, and a valid price are required.'
        });

    }


    if (price < 0) {

        return res.status(400).json({
            error: 'Price cannot be negative.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                UPDATE drinks

                SET name = $1,
                    description = $2,
                    price = $3

                WHERE id_drink = $4

                RETURNING
                    id_drink AS "idDrink",
                    name,
                    description,
                    price;
            `,
            [name, description, price, drinkID]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// EMPLOYEES
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ
app.get('/employees', async function (req, res) {

    try {

        const result = await db.pool.query(`
            SELECT ${EMPLOYEE_COLUMNS}
            FROM employees
            ORDER BY id_employee;
        `);


        res.render('employees', {
            pageTitle: 'Employees',
            data: result.rows
        });

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    }

});


// CREATE
app.post('/add-employee-ajax', async function (req, res) {

    const data = req.body;

    const name = data.name?.trim();
    const password = data.password?.trim();
    const phoneNum = data.phoneNum?.trim();
    const email = data.email?.trim();
    const address = data.address?.trim();


    if (
        !name ||
        !password ||
        !phoneNum ||
        !email ||
        !address
    ) {

        return res.status(400).json({
            error: 'All employee fields are required.'
        });

    }


    const client = await db.pool.connect();


    try {

        await client.query('BEGIN');


        const passwordResult = await client.query(
            `
                INSERT INTO passwords (password)
                VALUES ($1)
                RETURNING id_password;
            `,
            [password]
        );


        const newPasswordID =
            passwordResult.rows[0].id_password;


        const employeeResult = await client.query(
            `
                INSERT INTO employees (
                    name,
                    id_password,
                    phone_num,
                    email,
                    address
                )

                VALUES ($1, $2, $3, $4, $5)

                RETURNING
                    id_employee AS "idEmployee",
                    id_password AS "idPassword",
                    name,
                    phone_num AS "phoneNum",
                    email,
                    address;
            `,
            [
                name,
                newPasswordID,
                phoneNum,
                email,
                address
            ]
        );


        await client.query('COMMIT');


        res.status(201).json(
            employeeResult.rows[0]
        );

    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.sendStatus(400);

    } finally {

        client.release();

    }

});


// DELETE
app.delete('/delete-employee-ajax', async function (req, res) {

    const employeeID = parseInt(req.body.id, 10);


    if (Number.isNaN(employeeID)) {

        return res.status(400).json({
            error: 'A valid employee ID is required.'
        });

    }


    const client = await db.pool.connect();


    try {

        await client.query('BEGIN');


        const employeeResult = await client.query(
            `
                SELECT id_password
                FROM employees
                WHERE id_employee = $1;
            `,
            [employeeID]
        );


        if (employeeResult.rowCount === 0) {

            await client.query('ROLLBACK');

            return res.sendStatus(404);

        }


        const passwordID =
            employeeResult.rows[0].id_password;


        await client.query(
            `
                DELETE FROM employees
                WHERE id_employee = $1;
            `,
            [employeeID]
        );


        await client.query(
            `
                DELETE FROM passwords p

                WHERE p.id_password = $1

                AND NOT EXISTS (
                    SELECT 1
                    FROM employees e
                    WHERE e.id_password = p.id_password
                );
            `,
            [passwordID]
        );


        await client.query('COMMIT');


        res.sendStatus(204);

    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.sendStatus(400);

    } finally {

        client.release();

    }

});


// UPDATE
app.put('/put-employee-ajax', async function (req, res) {

    const data = req.body;

    const employeeID = parseInt(data.id, 10);

    const name = data.name?.trim();
    const phoneNum = data.phoneNum?.trim();
    const email = data.email?.trim();
    const address = data.address?.trim();


    if (Number.isNaN(employeeID)) {

        return res.status(400).json({
            error: 'A valid employee ID is required.'
        });

    }


    if (
        !name ||
        !phoneNum ||
        !email ||
        !address
    ) {

        return res.status(400).json({
            error: 'Name, phone number, email, and address are required.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                UPDATE employees

                SET name = $1,
                    phone_num = $2,
                    email = $3,
                    address = $4

                WHERE id_employee = $5

                RETURNING
                    id_employee AS "idEmployee",
                    id_password AS "idPassword",
                    name,
                    phone_num AS "phoneNum",
                    email,
                    address;
            `,
            [
                name,
                phoneNum,
                email,
                address,
                employeeID
            ]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ORDERS
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ
app.get('/orders', async function (req, res) {

    try {

        const [
            orderResult,
            customerResult,
            employeeResult
        ] = await Promise.all([

            db.pool.query(`
                SELECT ${ORDER_COLUMNS}
                FROM orders
                ORDER BY id_order;
            `),

            db.pool.query(`
                SELECT
                    id_customer AS "idCustomer",
                    name
                FROM customers
                ORDER BY id_customer;
            `),

            db.pool.query(`
                SELECT
                    id_employee AS "idEmployee",
                    name
                FROM employees
                ORDER BY id_employee;
            `)

        ]);


        res.render('orders', {
            pageTitle: 'Orders',
            orderData: orderResult.rows,
            customerData: customerResult.rows,
            employeeData: employeeResult.rows
        });

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    }

});


// CREATE
app.post('/add-order-ajax', async function (req, res) {

    const data = req.body;

    const employeeID = parseInt(data.idEmployee, 10);
    const customerID = parseInt(data.idCustomer, 10);

    const minutesToProcess =
        parseFloat(data.minutesToProcess);

    const orderDate =
        data.orderDate?.trim();


    if (
        Number.isNaN(employeeID) ||
        Number.isNaN(customerID) ||
        Number.isNaN(minutesToProcess) ||
        !orderDate
    ) {

        return res.status(400).json({
            error: 'Employee, customer, processing time, and order date are required.'
        });

    }


    if (minutesToProcess < 0) {

        return res.status(400).json({
            error: 'Processing time cannot be negative.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                INSERT INTO orders (
                    id_employee,
                    id_customer,
                    minutes_to_process,
                    order_date
                )

                VALUES ($1, $2, $3, $4)

                RETURNING
                    id_order AS "idOrder",
                    id_employee AS "idEmployee",
                    id_customer AS "idCustomer",
                    total_price AS "totalPrice",
                    minutes_to_process AS "minutesToProcess",
                    TO_CHAR(order_date, 'YYYY-MM-DD') AS "orderDate";
            `,
            [
                employeeID,
                customerID,
                minutesToProcess,
                orderDate
            ]
        );


        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});


// DELETE
app.delete('/delete-order-ajax', async function (req, res) {

    const orderID = parseInt(req.body.id, 10);


    if (Number.isNaN(orderID)) {

        return res.status(400).json({
            error: 'A valid order ID is required.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                DELETE FROM orders
                WHERE id_order = $1
                RETURNING id_order;
            `,
            [orderID]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        // orders_drinks uses ON DELETE CASCADE,
        // so its related rows are removed automatically.
        res.sendStatus(204);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});


// UPDATE
app.put('/put-order-ajax', async function (req, res) {

    const data = req.body;

    const orderID = parseInt(data.id, 10);
    const employeeID = parseInt(data.idEmployee, 10);
    const customerID = parseInt(data.idCustomer, 10);

    const minutesToProcess =
        parseFloat(data.minutesToProcess);

    const orderDate =
        data.orderDate?.trim();


    if (
        Number.isNaN(orderID) ||
        Number.isNaN(employeeID) ||
        Number.isNaN(customerID) ||
        Number.isNaN(minutesToProcess) ||
        !orderDate
    ) {

        return res.status(400).json({
            error: 'Valid Order, Employee, Customer, processing time, and date values are required.'
        });

    }


    if (minutesToProcess < 0) {

        return res.status(400).json({
            error: 'Processing time cannot be negative.'
        });

    }


    try {

        const result = await db.pool.query(
            `
                UPDATE orders

                SET id_employee = $1,
                    id_customer = $2,
                    minutes_to_process = $3,
                    order_date = $4

                WHERE id_order = $5

                RETURNING
                    id_order AS "idOrder",
                    id_employee AS "idEmployee",
                    id_customer AS "idCustomer",
                    total_price AS "totalPrice",
                    minutes_to_process AS "minutesToProcess",
                    TO_CHAR(order_date, 'YYYY-MM-DD') AS "orderDate";
            `,
            [
                employeeID,
                customerID,
                minutesToProcess,
                orderDate,
                orderID
            ]
        );


        if (result.rowCount === 0) {

            return res.sendStatus(404);

        }


        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error(error);
        res.sendStatus(400);

    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ORDER ITEMS
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// READ
app.get('/orders_drinks', async function (req, res) {

    try {

        const [
            orderDrinkResult,
            orderResult,
            drinkResult
        ] = await Promise.all([

            db.pool.query(`
                SELECT ${ORDER_DRINK_COLUMNS}

                FROM orders_drinks od

                INNER JOIN drinks d
                    ON od.id_drink = d.id_drink

                ORDER BY od.id_order_drink;
            `),

            db.pool.query(`
                SELECT id_order AS "idOrder"
                FROM orders
                ORDER BY id_order;
            `),

            db.pool.query(`
                SELECT
                    id_drink AS "idDrink",
                    name,
                    price
                FROM drinks
                ORDER BY id_drink;
            `)

        ]);


        res.render('orders_drinks', {
            pageTitle: 'Order Items',
            orderDrinkData: orderDrinkResult.rows,
            orderData: orderResult.rows,
            drinkData: drinkResult.rows
        });

    } catch (error) {

        console.error(error);
        res.sendStatus(500);

    }

});


// CREATE
app.post('/add-order_drink-ajax', async function (req, res) {

    const data = req.body;

    const orderID = parseInt(data.idOrder, 10);
    const drinkID = parseInt(data.idDrink, 10);
    const quantity = parseInt(data.quantity, 10);


    if (
        Number.isNaN(orderID) ||
        Number.isNaN(drinkID) ||
        Number.isNaN(quantity) ||
        quantity <= 0
    ) {

        return res.status(400).json({
            error: 'A valid Order, Drink, and quantity greater than zero are required.'
        });

    }


    const client = await db.pool.connect();


    try {

        await client.query('BEGIN');


        const drinkResult = await client.query(
            `
                SELECT price
                FROM drinks
                WHERE id_drink = $1;
            `,
            [drinkID]
        );


        if (drinkResult.rowCount === 0) {

            await client.query('ROLLBACK');

            return res.status(404).json({
                error: 'Drink not found.'
            });

        }


        const drinkPrice =
            parseFloat(drinkResult.rows[0].price);

        const drinkTotal =
            drinkPrice * quantity;


        const insertResult = await client.query(
            `
                INSERT INTO orders_drinks (
                    id_order,
                    id_drink,
                    quantity,
                    drink_total
                )

                VALUES ($1, $2, $3, $4)

                RETURNING id_order_drink;
            `,
            [
                orderID,
                drinkID,
                quantity,
                drinkTotal
            ]
        );


        const newOrderDrinkID =
            insertResult.rows[0].id_order_drink;


        await recalculateOrderTotal(
            orderID,
            client
        );


        const result = await client.query(
            `
                SELECT ${ORDER_DRINK_COLUMNS}

                FROM orders_drinks od

                INNER JOIN drinks d
                    ON od.id_drink = d.id_drink

                WHERE od.id_order_drink = $1;
            `,
            [newOrderDrinkID]
        );


        await client.query('COMMIT');


        res.status(201).json(result.rows[0]);

    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.sendStatus(400);

    } finally {

        client.release();

    }

});


// DELETE
app.delete('/delete-order_drink-ajax', async function (req, res) {

    const orderDrinkID =
        parseInt(req.body.id, 10);


    if (Number.isNaN(orderDrinkID)) {

        return res.status(400).json({
            error: 'A valid Order Item ID is required.'
        });

    }


    const client = await db.pool.connect();


    try {

        await client.query('BEGIN');


        const result = await client.query(
            `
                SELECT id_order
                FROM orders_drinks
                WHERE id_order_drink = $1;
            `,
            [orderDrinkID]
        );


        if (result.rowCount === 0) {

            await client.query('ROLLBACK');

            return res.sendStatus(404);

        }


        const orderID =
            result.rows[0].id_order;


        await client.query(
            `
                DELETE FROM orders_drinks
                WHERE id_order_drink = $1;
            `,
            [orderDrinkID]
        );


        await recalculateOrderTotal(
            orderID,
            client
        );


        await client.query('COMMIT');


        res.sendStatus(204);

    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.sendStatus(400);

    } finally {

        client.release();

    }

});


// UPDATE
app.put('/put-order_drink-ajax', async function (req, res) {

    const data = req.body;

    const orderDrinkID =
        parseInt(data.id, 10);

    const newOrderID =
        parseInt(data.idOrder, 10);

    const drinkID =
        parseInt(data.idDrink, 10);

    const quantity =
        parseInt(data.quantity, 10);


    if (
        Number.isNaN(orderDrinkID) ||
        Number.isNaN(newOrderID) ||
        Number.isNaN(drinkID) ||
        Number.isNaN(quantity) ||
        quantity <= 0
    ) {

        return res.status(400).json({
            error: 'Valid Order Item, Order, Drink, and quantity values are required.'
        });

    }


    const client = await db.pool.connect();


    try {

        await client.query('BEGIN');


        const originalResult = await client.query(
            `
                SELECT id_order
                FROM orders_drinks
                WHERE id_order_drink = $1;
            `,
            [orderDrinkID]
        );


        if (originalResult.rowCount === 0) {

            await client.query('ROLLBACK');

            return res.sendStatus(404);

        }


        const oldOrderID =
            originalResult.rows[0].id_order;


        const drinkResult = await client.query(
            `
                SELECT price
                FROM drinks
                WHERE id_drink = $1;
            `,
            [drinkID]
        );


        if (drinkResult.rowCount === 0) {

            await client.query('ROLLBACK');

            return res.sendStatus(404);

        }


        const drinkPrice =
            parseFloat(drinkResult.rows[0].price);

        const drinkTotal =
            drinkPrice * quantity;


        await client.query(
            `
                UPDATE orders_drinks

                SET id_order = $1,
                    id_drink = $2,
                    quantity = $3,
                    drink_total = $4

                WHERE id_order_drink = $5;
            `,
            [
                newOrderID,
                drinkID,
                quantity,
                drinkTotal,
                orderDrinkID
            ]
        );


        await recalculateOrderTotal(
            oldOrderID,
            client
        );


        if (newOrderID !== oldOrderID) {

            await recalculateOrderTotal(
                newOrderID,
                client
            );

        }


        const result = await client.query(
            `
                SELECT ${ORDER_DRINK_COLUMNS}

                FROM orders_drinks od

                INNER JOIN drinks d
                    ON od.id_drink = d.id_drink

                WHERE od.id_order_drink = $1;
            `,
            [orderDrinkID]
        );


        await client.query('COMMIT');


        res.status(200).json(result.rows[0]);

    } catch (error) {

        await client.query('ROLLBACK');

        console.error(error);

        res.sendStatus(400);

    } finally {

        client.release();

    }

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// HELPER FUNCTIONS
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Recalculate an Order's total from the stored line-item totals.
//
// A database client can optionally be supplied so this operation can
// participate in the same PostgreSQL transaction as another operation.
async function recalculateOrderTotal(
    orderID,
    client = db.pool
) {

    return client.query(
        `
            UPDATE orders

            SET total_price = (
                SELECT COALESCE(
                    SUM(drink_total),
                    0
                )

                FROM orders_drinks

                WHERE id_order = $1
            )

            WHERE id_order = $1;
        `,
        [orderID]
    );

}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// ERROR HANDLER
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.use(function (error, req, res, next) {

    console.error(error);

    res.status(500).json({
        error: 'Internal server error.'
    });

});



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// LOCAL LISTENER / VERCEL EXPORT
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// When app.js is run directly with:
//
//     node app.js
//
// start a local HTTP server.
//
// When Vercel imports this file, it uses the exported Express
// application instead and manages the HTTP infrastructure itself.
if (require.main === module) {

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

}


module.exports = app;