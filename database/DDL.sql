-- This file serves as the basis for our database. It creates the tables used by our fictional coffee shop,
-- Unreal Coffee, including: Passwords, Employees, Customers, Orders, Drinks, and Orders_Drinks.
--
-- This project was originally developed for a database course and later revisited and improved as part of
-- my continued software-development work. Improvements include cleaner CRUD behavior, stronger handling of
-- relational integrity, automatic Order total calculations, improved Orders_Drinks functionality, and a
-- redesigned user interface.
--
-- Example data is included at the end of the file to provide a predictable baseline for testing.

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
  FOREIGN KEY (idPassword)
      REFERENCES Passwords(idPassword)
      ON DELETE CASCADE
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

  -- idCustomer allows NULL because deleting a Customer
  -- should NOT delete the Order. Instead, MariaDB will set
  -- the Order's idCustomer value to NULL.
  idCustomer INT NULL,

  -- totalPrice is calculated from the Drinks belonging to the Order.
  -- A newly-created Order begins at $0.00 because it has no Drinks yet.
  totalPrice DECIMAL(5,2) NOT NULL DEFAULT 0.00,

  minutesToProcess DECIMAL(3,1) NOT NULL,
  orderDate DATE NOT NULL,

  PRIMARY KEY (idOrder),

  -- If an Employee is deleted, keep the Order
  -- and remove only the Employee reference.
  FOREIGN KEY (idEmployee)
      REFERENCES Employees(idEmployee)
      ON DELETE SET NULL,

  -- If a Customer is deleted, keep the Order
  -- and remove only the Customer reference.
  FOREIGN KEY (idCustomer)
      REFERENCES Customers(idCustomer)
      ON DELETE SET NULL
);


-- SQL statement to create our Drinks table. 
CREATE OR REPLACE TABLE Drinks (
  idDrink INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(145) NOT NULL,
  description VARCHAR(145) NOT NULL, 
  price DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (idDrink)
);


-- SQL statement to create our Orders_Drinks table.
-- This junction table connects Drinks to Orders and stores quantity and line totals.
CREATE OR REPLACE TABLE Orders_Drinks(
  idOrderDrink INT NOT NULL AUTO_INCREMENT,
  idOrder INT NOT NULL,
  idDrink INT NOT NULL,
  quantity INT NOT NULL,
  drinkTotal DECIMAL(5,2) NOT NULL,

  PRIMARY KEY (idOrderDrink),

  FOREIGN KEY (idOrder)
      REFERENCES Orders(idOrder)
      ON DELETE CASCADE,

  FOREIGN KEY (idDrink)
      REFERENCES Drinks(idDrink)
);


-- ***INSERT DATA***


-- (1) Passwords 
INSERT INTO Passwords (
    password
)
VALUES
    ("cedar_roast"),
    ("morning_shift"),
    ("pnw_coffee"),
    ("espresso_time"),
    ("unreal_staff")
;


-- (2) Employees 
INSERT INTO Employees (
    idEmployee,
    name,
    phoneNum,
    email,
    address,
    idPassword
)
VALUES
    (
        1,
        "Maya Thompson",
        "503-555-0142",
        "maya.thompson@example.com",
        "214 NW Everett St",
        1
    ),

    (
        2,
        "Elliot Parker",
        "503-555-0187",
        "elliot.parker@example.com",
        "812 SE Belmont St",
        2
    ),

    (
        3,
        "Nina Brooks",
        "503-555-0164",
        "nina.brooks@example.com",
        "425 NE Alberta St",
        3
    ),

    (
        4,
        "Caleb Morgan",
        "503-555-0129",
        "caleb.morgan@example.com",
        "1160 NW 23rd Ave",
        4
    ),

    (
        5,
        "Sophie Chen",
        "503-555-0195",
        "sophie.chen@example.com",
        "730 SE Hawthorne Blvd",
        5
    )
;


-- (3) Customers
INSERT INTO Customers (
    idCustomer,
    name,
    phoneNum,
    email
)
VALUES
    (
        1,
        "Avery Collins",
        "503-555-0211",
        "avery.collins@example.com"
    ),

    (
        2,
        "Jordan Reed",
        "503-555-0224",
        "jordan.reed@example.com"
    ),

    (
        3,
        "Morgan Lee",
        "503-555-0236",
        "morgan.lee@example.com"
    ),

    (
        4,
        "Taylor Nguyen",
        "503-555-0248",
        "taylor.nguyen@example.com"
    ),

    (
        5,
        "Riley Foster",
        "503-555-0253",
        "riley.foster@example.com"
    )
;


-- (4) Orders 
INSERT INTO Orders (
    idOrder,
    idEmployee,
    idCustomer,
    totalPrice,
    minutesToProcess,
    orderDate
)
VALUES 
    (1, 1, 2, 10.00, 5.0, '2026-10-06'),
    (2, 4, 1, 11.00, 4.0, '2026-10-06'),
    (3, 2, 3, 9.00, 3.0, '2026-10-07'),
    (4, 3, 4, 9.00, 4.0, '2026-10-07'),
    (5, 5, 2, 5.50, 2.0, '2026-10-08')
;


-- (5) Drinks
INSERT INTO Drinks (
    idDrink,
    name,
    description,
    price
)
VALUES
    (
        1,
        "Willamette Latte",
        "Classic espresso with smooth steamed milk.",
        5.00
    ),

    (
        2,
        "Burnside Cappuccino",
        "Espresso topped with steamed milk and thick foam.",
        5.50
    ),

    (
        3,
        "Cascade Americano",
        "Espresso and hot water with a smooth, balanced finish.",
        4.00
    ),

    (
        4,
        "Rose City Cold Brew",
        "Slow-steeped cold brew served smooth and chilled.",
        5.00
    ),

    (
        5,
        "Mount Hood Mocha",
        "Espresso with chocolate and steamed milk.",
        4.50
    )
;


-- (6) Orders_Drinks 
INSERT INTO Orders_Drinks (
    idOrder,
    idDrink,
    quantity,
    drinkTotal
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