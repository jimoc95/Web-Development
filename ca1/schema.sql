DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
);  

DROP TABLE IF EXISTS admin;

CREATE TABLE admin
(
    admin_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
); 

INSERT INTO admin (admin_id, password)
VALUES ('joc', 'ca1'),
       ('jfk', 'cawd');

DROP TABLE IF EXISTS tools;

CREATE TABLE tools
(
    tool_id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL
);  

INSERT INTO tools (image, name, price, description)
VALUES  ('shovel.jpg','Shovel', 35.99, 'A sturdy oak handled shovel'),
        ('claw_hammer.jpg', 'Claw Hammer', 17.99, 'Perfect for pulling and driving all types of nails.'),
        ('saw.jpg', 'Saw', 15.99, 'Cut away that dead wood!'),
        ('drill.jpg', 'Cordless Drill', 54.99, 'This is what true freedom looks like!'),
        ('sledgehammer.jpg', 'Sledgehammer', 59.99, 'Perfect for smashing up TVs!'),
        ('socket_set.jpg', 'Socket Set', 125.99, 'Get some sockets in your pocket!'),
        ('air_compressor.jpg', 'Air Compressor', 12.99, 'Nothing beats a breath of fresh air!'),
        ('pliers.jpg', 'Pliers', 22.99, 'Catch anything, even your nose!'),
        ('measuring_tape.jpg', 'Measuring Tape', 15.99, 'Measuring Tape 40 metres in length.'),
        ('paintbrush.jpg', 'Paintbrush', 4.99,'Paint the town red!'),
        ('spade.jpg', 'Spade', 25.99,'The ace of spades!'),
        ('screwdriver.jpg', 'Screwdriver', 10.99,'Phillips screwdriver.');

DROP TABLE IF EXISTS orders;

CREATE TABLE orders
(
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    total REAL NOT NULL,   
    customer_name TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    payment_method TEXT NOT NULL
); 

DROP TABLE IF EXISTS stock;

CREATE TABLE stock
(
    tool_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    stock_qty INTEGER NOT NULL,
    location TEXT
);  

INSERT INTO stock (name, stock_qty, location)
VALUES  ('Grave Digger', 30, 'Shop'),
        ('Claw Hammer', 25, 'Shop'),
        ('Saw', 75, 'Shop'),
        ('Cordless Drill', 10, 'Warehouse'),
        ('Sledge Hammer', 5, 'Shop'),
        ('Hedge Clippers', 11, 'Shop'),
        ('Air Compressor', 4, 'Warehouse'),
        ('Mig Welder', 2, 'Warehouse'),
        ('Strimmer', 7, 'Warehouse'),
        ('Paintbrush', 20,'Shop'),
        ('Spade', 12,'Shop');

DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews
(
    tool_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    stars INTEGER NOT NULL,
    review TEXT NOT NULL
); 
