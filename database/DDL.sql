-- This file serves as the basis for our database. It effectively creates all the different tables in our database,
-- including: Passwords, Employees, Customers, Orders, Drinks, and Orders-Drinks. This database is designed to 
-- store data regarding our fictional restaurant, Latte Larrys. This sql file is designed to meet all the needs
-- of our database for the Project deliverables, including: creating tables that possess a variety of different
-- attributes and interact with other tables in clear relationships, ensuring that the relationships between 
-- tables operate as intended and don't result in any typical database errors, and including/inserting example 
-- data for our tables (located at the end of the file) to verify that our tables function correctly. 

SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


-- SQL statement to create our Passwords table. 
CREATE OR REPLACE TABLE Passwords (
  idPassword INT NOT NULL AUTO_INCREMENT,
  password VARCHAR(256) NOT NULL,
  PRIMARY KEY (idPassword)
);

-- SQL statement to create our Employees table. 
CREATE OR REPLACE TABLE Employees (
  idEmployee INT NOT NULL AUTO_INCREMENT UNIQUE,
  idPassword INT NOT NULL,
  name VARCHAR(145) NOT NULL,
  phoneNum VARCHAR(20) NOT NULL,
  email VARCHAR(145) NOT NULL,
  address VARCHAR(145) NOT NULL,
  PRIMARY KEY (idEmployee),
  FOREIGN KEY (idPassword) REFERENCES Passwords(idPassword) ON DELETE CASCADE
);

-- SQL statement to create our Customers table. 
CREATE OR REPLACE TABLE Customers (
  idCustomer INT NOT NULL AUTO_INCREMENT UNIQUE,
  name VARCHAR(145) NOT NULL,
  phoneNum VARCHAR(20) NULL,
  email VARCHAR(145) NULL,
  PRIMARY KEY (idCustomer)
);

-- SQL statement to create our Orders table. 
CREATE OR REPLACE TABLE Orders (
  idOrder INT NOT NULL AUTO_INCREMENT,
  idEmployee INT,
  idCustomer INT NOT NULL,
  totalPrice DECIMAL (5,2) NOT NULL,
  minutesToProcess DECIMAL (3,1) NOT NULL,
  orderDate DATE NOT NULL,
  PRIMARY KEY (idOrder),
  FOREIGN KEY (idEmployee) REFERENCES Employees(idEmployee) ON DELETE SET NULL,
  FOREIGN KEY (idCustomer) REFERENCES Customers(idCustomer) ON DELETE CASCADE
);

-- SQL statement to create our Drinks table. 
CREATE OR REPLACE TABLE Drinks (
  idDrink INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(145) NOT NULL,
  description VARCHAR(145) NOT NULL, 
  price DECIMAL (3,2) NOT NULL,
  PRIMARY KEY (idDrink)
);

-- SQL statement to create our Orders_Drinks table. 
CREATE OR REPLACE TABLE Orders_Drinks(
  idOrder INT NOT NULL,
  idDrink INT NOT NULL,
  quantity INT NOT NULL,
  drinkTotal DECIMAL(5,2) NOT NULL,
  FOREIGN KEY (idOrder) REFERENCES Orders(idOrder) ON DELETE CASCADE,
  FOREIGN KEY (idDrink) REFERENCES Drinks(idDrink)
);



-- ***INSERT DATA***

-- (1) Passwords 
INSERT INTO Passwords (
    password
)
VALUES
    ("immapassword"),
    ("password123"),
    ("knockknock"),
    ("Joe_biden"),
	("love_coffee_ll")
;

-- (2) Employees 
INSERT INTO Employees (
    idEmployee, name, phoneNum, email, address, idPassword
)
VALUES
    (1, "John Smith", "555-555-5555", "John@gmail.com", "440 East Knoll Dr", 1),
    (2, "Sarah Lock", "544-444-4444", "Sarah@gmail.com", "320 Hill Dr", 2),
    (3, "Adam Hurt", "444-333-2222", "Adam@hotmail.com", "820 Scenic Route", 3),
    (4, "Susan Sue", "333-222-1111", "Susan@gmail.com", "562 Hill Dr", 4),
    (5, "Larry David", "234-523-2132", "Larry@gmail.com", "295 David Blvd", 5)
;

-- (3) Customers
INSERT INTO Customers (
    idCustomer, name, phoneNum, email
)
VALUES
    (1, "Maddy Sane", "111-111-1111", "maddy@gmail.com"),
    (2, "Hannah Shirley", "233-233-2323", "hannah@gmail.com"),
    (3, "Donald Trump", "444-454-4545", "donald@gmail.com"),
    (4, "David Laver", "555-454-5555", "larry@gmail.com"),
	(5, "Bob Smith", "541-982-723", "bob@gmail.com")
;

-- (4) Orders 
INSERT INTO Orders (
    idOrder, idEmployee, idCustomer, totalPrice, minutesToProcess, orderDate
)
VALUES 
    (1, 1, 2, 10, 5, '2024-04-18'),
    (2, 4, 1, 11, 4, '2024-04-18'),
    (3, 2, 3, 9, 3, '2024-04-19'),
    (4, 3, 4, 9, 4, '2024-04-19'),
    (5, 5, 2, 5.50, 2, '2024-04-20')
;

-- (5) Drinks
INSERT INTO Drinks (
    idDrink, name, description, price
)
VALUES
    (1, "Larry's Latte", "Just a typical Latte, made by Larry.", 5.00),
    (2, "Larry's Cappuccino", "Just a typical Cappuccino, made by Larry.", 5.50),
    (3, "Larry's Americano", "Just your typical Americano, but made by Larry.", 4.00),
    (4, "Larry's Cold Brew", "Normal Cold Brew, but Larry made it.", 5.00),
	(5, "Larry's Mocha", "Just a typical Mocha, made by Larry", 4.5)
;

-- (6) Orders_Drinks 
INSERT INTO Orders_Drinks (
    idOrder, idDrink, quantity, drinkTotal
)
VALUES 
    (1, 1, 1, 5.00),
    (1, 4, 1, 5.00),
    (2, 2, 2, 11.00),
    (3, 3, 1, 4.00),
    (3, 4, 1, 5.00),
    (4, 1, 1, 5.00),
    (4, 3, 1, 4.00),
    (5, 2, 1, 5.50)
;


SET FOREIGN_KEY_CHECKS=1;
COMMIT;
