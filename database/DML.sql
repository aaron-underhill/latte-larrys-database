

----------------------------------------------------
--EMPLOYEE QUERIES
----------------------------------------------------

--Select all employee info
SELECT * FROM Employees;

--add a new employee
INSERT INTO Employees(name, idPassword, phoneNum, email, address)
VALUES (
	:employeeNameInput,
	:idPasswordInput
	:employeePhoneNumInput,
	:emailInput,
	:addressInput,
);


----------------------------------------------------
--PASSWORD QUERIES
----------------------------------------------------

--Select all Password info
SELECT * FROM Passwords;

--add a new Password
INSERT INTO Passwords(password)
VALUES (:passwordInput);


----------------------------------------------------
--CUSTOMER QUERIES
----------------------------------------------------

--Select all Customer info
SELECT * FROM Customers;

--add a new Customer
INSERT INTO Customers(name, phoneNum, email)
VALUES (
	:nameInput,
	:phoneNumInput,
	:emailInput
);

-- update a Customer
UPDATE Customers SET name = :nameInput, phoneNum = :phoneNumInput, email = :emailInput WHERE idCustomer = :selectedCustomerID;

-- delete a Customer
DELETE FROM Customers WHERE idCustomer = :selectedCustomerID


----------------------------------------------------
--ORDERS QUERIES
----------------------------------------------------

--Select all Order info
SELECT * FROM Orders;

--add a new Order
INSERT INTO Orders(idEmployee, idCustomer, totalPrice, minutesToProcess, orderDate)
VALUES (
	:idEmployeeInput,
	:idCustomerInput,
	(SELECT SUM(drinkTotal) FROM Orders_Drinks
	 INNER JOIN Orders ON Orders_Drinks.idOrder = Orders.idOrder
	 WHERE Orders_Drinks.idOrder = 5),
	:minutesToPrcoessInput,
	:orderDateInput
);

--delete an Order
DELETE FROM Orders WHERE idOrder = :selectedOrderID;


----------------------------------------------------
--DRINKS QUERIES
----------------------------------------------------

--Select all Drink info
SELECT * FROM Drinks;

--add a new Drink
INSERT INTO Drinks(name, description, price)
VALUES (:nameInput, :descriptionInput, :priceInput);


----------------------------------------------------
--ORDERS-DRINKS QUERIES
----------------------------------------------------

--Select all from Orders-Drinks
SELECT * FROM Orders-Drinks;

--add a new Drink to an Order
INSERT INTO Orders-Drinks(idOrder, idDrink, quantity, drinktTotal)
VALUES (
	:idOrderInput,
	:idDrinkInput,
	:quantityInput,
	(SELECT (SELECT price FROM Drinks WHERE idDrink = :idDrinkInput) * :quantityInput FROM Orders_Drinks WHERE idOrder = :idOrderInput AND idDrink = :idDrinkInput)
);
