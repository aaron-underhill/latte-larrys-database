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

app.get('/customers', function(req, res)
{
    // Declare Query 1
    query1 = "SELECT * FROM Customers;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('customers', {data: rows});
    })
});

app.post('/add-customer-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (name, phoneNum, email) VALUES ('${data.name}', '${data.phoneNum}', '${data.email}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Customers
            query2 = `SELECT * FROM Customers;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-customer-ajax/', function(req,res,next){
  let data = req.body;
  console.log(data.id);
  let customerID = parseInt(data.id);
  let deleteCustomer = `DELETE FROM Customers WHERE idCustomer = ?`;

        // Run the 1st query
        db.pool.query(deleteCustomer, [customerID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                res.sendStatus(204)
            }
})});

app.put('/put-customer-ajax', function(req,res,next){                                   
  let data = req.body;

  let customerID = parseInt(data.id);
  let name = data.name;
  let phoneNum = data.phoneNum;
  let email = data.email;

  queryUpdateCustomer = `UPDATE Customers SET name = ?, phoneNum = ?, email = ? WHERE Customers.idCustomer = ?`;

        // Run the 1st query
        db.pool.query(queryUpdateCustomer, [name, phoneNum, email, customerID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end

})});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   CUSTOMERS PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   DRINKS PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/drinks', function(req, res)
{
    // Declare Query 1
    query1 = "SELECT * FROM Drinks;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('drinks', {data: rows});
    })
});

app.post('/add-drink-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Drinks (name, description, price) VALUES ("${data.name}", "${data.description}", '${parseFloat(data.price)}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Drinks
            query2 = `SELECT * FROM Drinks;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-drink-ajax/', function(req,res,next){
  let data = req.body;

  let drinkID = parseInt(data.id);
  let deleteDrink = `DELETE FROM Drinks WHERE idDrink = ?`;

        // Run the 1st query
        db.pool.query(deleteDrink, [drinkID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                res.sendStatus(204);
            }
})});

app.put('/put-drink-ajax', function(req,res,next){                                   
  let data = req.body;

  let drinkID = parseInt(data.id);
  let name = data.name;
  let desc = data.description;
  let price = parseFloat(data.price);

  queryUpdateDrink = `UPDATE Drinks SET name = ?, description = ?, price = ? WHERE Drinks.idDrink = ?`;

        // Run the 1st query
        db.pool.query(queryUpdateDrink, [name, desc, price, drinkID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end

})});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   DRINKS PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   EMPLOYEES PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/employees', function(req, res)
{
    // Declare Query 1
    let query1 = "SELECT * FROM Employees;";

    db.pool.query(query1, function(error, rows, fields){
        res.render('employees', {data: rows});
    })
});

app.post('/add-employee-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (name, idPassword, phoneNum, email, address) VALUES ('${data.name}', '${data.idPassword}', '${data.phoneNum}', '${data.email}', '${data.address}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Employees;`;
            db.pool.query(query2, function(error, rows, fields) {

                if (error) {

                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
            
        }
    })
});

app.delete('/delete-employee-ajax/', function(req,res,next){
  let data = req.body;

  let employeeID = parseInt(data.id);

  let deleteEmployee = `DELETE FROM Employees WHERE idEmployee = '${employeeID}'`;

        // Run the 1st query
        db.pool.query(deleteEmployee, function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                res.sendStatus(204);

            }
})});

app.put('/put-employee-ajax', function(req,res,next){                                   
  let data = req.body;

  let id = data.id;
  let name = data.name;
  let phoneNum = data.phoneNum;
  let email = data.email;
  let address = data.address;

  queryUpdateEmployee = `UPDATE Employees SET name = '${name}', phoneNum = '${phoneNum}', email = '${email}', address = '${address}' WHERE idEmployee = '${id}'`;

        // Run the 1st query
        db.pool.query(queryUpdateEmployee, function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end

})});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   EMPLOYEES PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS PAGE START
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get('/orders', function(req, res)
{
    // Declare Query 1
    let query1 = "SELECT * FROM Orders;";
    let query2 = "SELECT * FROM Customers;";
    let query3 = "SELECT * FROM Employees;";

    db.pool.query(query1, function(error, rows, fields){
        db.pool.query(query2, function(error2, rows2, fields2){
            db.pool.query(query3, function(error3, rows3, fields3){
                res.render('orders', {orderData: rows, customerData: rows2, employeeData: rows3});
            })
        })
        //res.render('orders', {data: rows});
    })
});


app.post('/add-order-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (idEmployee, idCustomer, totalPrice, minutesToProcess, orderDate) VALUES ('${parseInt(data.employee)}', '${parseInt(data.customer)}', '${0}', '${parseFloat(data.minutes)}', '${data.date}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Orders;`;
            db.pool.query(query2, function(error, rows, fields) {

                if (error) {

                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
            
        }
    })
});

app.delete('/delete-order-ajax/', function(req,res,next){
    let data = req.body;
  
    let orderID = parseInt(data.id);
  
    let deleteOrder = `DELETE FROM Orders WHERE idOrder = '${orderID}'`;
  
          // Run the 1st query
          db.pool.query(deleteOrder, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  res.sendStatus(204);
  
              }
  })});

  app.put('/put-order-ajax', function(req,res,next){                                   
    let data = req.body;
  
    queryUpdateOrder = `UPDATE Orders SET idEmployee = '${parseInt(data.employee)}', idCustomer = '${parseInt(data.customer)}', totalPrice = '${0}', minutesToProcess = '${parseFloat(data.minutes)}', orderDate = '${data.date}' WHERE idOrder = '${data.orderID}'`; 
  
          // Run the 1st query
          db.pool.query(queryUpdateOrder, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
  
  })});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS PAGE END
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// Here, as mentioned above, we adapted code from the course's nodejs-startapp repository. However, as evident, we did make 
// necessary changes in order for the code to be correctly implemented and work as intended for our database. 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS_DRINKS PAGE START
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/orders_drinks', function(req, res)
{


    let query1 = "SELECT * FROM Orders_Drinks;";               // Define our query

    db.pool.query(query1, function(error, rows, fields){    // Execute the query

        res.render('orders_drinks', {data: rows});                  // Render the index.hbs file, and also send the renderer
    })


/*
    // Declare Query 1
    let query1 = "SELECT * FROM Orders_Drinks;";
    let query2 = "SELECT * FROM Customers;";
    let query3 = "SELECT * FROM Employees;";

    db.pool.query(query1, function(error, rows, fields){
        db.pool.query(query2, function(error2, rows2, fields2){
            db.pool.query(query3, function(error3, rows3, fields3){
                res.render('orders_drinks', {order_drinkData: rows, customerData: rows2, employeeData: rows3});
            })
        })
    })
    */
});

app.post('/add-order_drink-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders-Drinks (idEmployee, idCustomer, totalPrice, minutesToProcess, orderDate) VALUES ('${parseInt(data.employee)}', '${parseInt(data.customer)}', '${0}', '${parseFloat(data.minutes)}', '${data.date}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Orders_Drinks;`;
            db.pool.query(query2, function(error, rows, fields) {

                if (error) {

                    console.log(error)
                    res.sendStatus(400);
                }
                else {
                    res.send(rows);
                }
            })
            
        }
    })
});

app.delete('/delete-order_drink-ajax/', function(req,res,next){
    let data = req.body;
  
    let orderDrinkID = parseInt(data.id);
  
    let deleteOrderDrink = `DELETE FROM Orders_Drinks WHERE idOrderDrink = '${orderDrinkID}'`;
  
          // Run the 1st query
          db.pool.query(deleteOrderDrink, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  res.sendStatus(204);
  
              }
  })});

app.put('/put-order_drink-ajax', function(req,res,next){                                   
    let data = req.body;
  
    queryUpdateOrderDrink = `UPDATE Orders_Drinks SET idEmployee = '${parseInt(data.employee)}', idCustomer = '${parseInt(data.customer)}', totalPrice = '${0}', minutesToProcess = '${parseFloat(data.minutes)}', orderDate = '${data.date}' WHERE idOrderDrink = '${data.orderDrinkID}'`; 
  
          // Run the 1st query
          db.pool.query(queryUpdateOrderDrink, function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
  
  })});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                   ORDERS-DRINKS PAGE END
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});