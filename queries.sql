-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     name TEXT NOT NULL,
--     email TEXT UNIQUE NOT NULL,
--     age INT,
--     created_at TIMESTAMP DEFAULT NOW()
-- );

-- INSERT INTO users (name, email, age) VALUES 
-- 	('Mateo Banda', 'mat@gmail.com', 50),
--     ('Mary Lungu', 'mary@gmail.com', 20);


-- INSERT INTO users (name, email, age) VALUES 
-- 	('New User', 'new@gmail.com', 70);


-- SELECT * FROM users;
-- SELECT name, age FROM users WHERE age > 27;
-- SELECT name, age FROM users ORDER BY age asc;

-- UPDATE users SET name = 'Mary' WHERE name = 'Mary Lungu'
-- DELETE FROM users WHERE name = 'Mary'
-- SELECT * FROM users;

-- INSERT INTO users (name, email, age) VALUES ('Test', 'test@gmail.com', 22);
-- SELECT * FROM users;



-- CREATE TABLE orders (
-- 	id SERIAL PRIMARY KEY,
-- 	user_id INT REFERENCES users(id),
-- 	product TEXT NOT NULL,
-- 	amount NUMERIC(10, 2),
-- 	ordered_at TIMESTAMP DEFAULT NOW()
-- );

-- INSERT INTO orders (user_id, product, amount) VALUES 
-- (1, 'Dell Laptop', 100.99),
-- (3, 'G-Wagon', 25000.00),
-- (3, 'HP Laptop', 200.00);

-- SELECT u.name, COALESCE(SUM(o.amount), 0) as total_spend, COUNT(o.id) as orders
-- FROM users u
-- LEFT JOIN orders o ON o.user_id = u.id
-- GROUP BY u.id;

-- CREATE INDEX idx_orders_user_id ON orders(user_id);

-- SET enable_seqscan = ON;

-- EXPLAIN ANALYZE
-- SELECT * FROM orders WHERE user_id = 1;

-- WITH user_total_spend AS (
--     SELECT
--         user_id,
--         SUM(amount) AS total_spend
--     FROM
--         orders
--     GROUP BY
--         user_id
-- )
-- SELECT
--     u.name,
--     uts.total_spend,
--     CASE
--         WHEN uts.total_spend > 1000 THEN 'high'
--         ELSE 'low'
--     END AS spending_label
-- FROM
--     users u
-- JOIN
--     user_total_spend uts ON u.id = uts.user_id;


-- SELECT name FROM users
-- 	WHERE id IN (
-- SELECT user_id FROM orders where amount > 500
-- 	);

-- WITH big_orders AS (
-- 	SELECT user_id FROM orders where amount > 500
-- )
-- SELECT name from users
-- WHERE id IN (SELECT user_id FROM big_orders)


-- WITH users_total_spend AS (
-- 	SELECT
-- 	   user_id,
-- 	   SUM(amount) as total_spend
-- 	FROM orders 
-- 	GROUP BY user_id	
-- ) 
-- SELECT 
-- 	u.name,
--     uts.total_spend,
-- CASE
-- WHEN total_spend > 1000 THEN 'high'
-- WHEN total_spend > 100 THEN 'medium'
-- ELSE 'low'
-- 	END AS spend_labelling
-- FROM users u
-- JOIN users_total_spend uts ON uts.user_id = u.id;


-- INSERT INTO orders (user_id, product, amount) VALUES 
-- (4, 'Dell Laptop', 50);


-- WITH ranked_orders AS (
--   SELECT *,
--          ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY ordered_at DESC) as rn
--   FROM orders
-- )
-- SELECT * FROM ranked_orders WHERE rn = 1;


-- WITH price_ranked_orders AS (
-- 	SELECT *,
-- 	       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount ASC) as price_rank
-- 	FROM orders
-- )
-- SELECT * FROM price_ranked_orders;



-- CREATE TABLE categories(
-- 	id SERIAL PRIMARY KEY,
-- 	name TEXT
-- );

-- CREATE TABLE products(
-- 	id SERIAL PRIMARY KEY,
-- 	name TEXT,
-- 	category_id INT REFERENCES categories(id),
-- 	in_stock BOOLEAN,
-- 	quantity INT,
-- 	created_at TIMESTAMP default NOW()
-- );

-- CREATE TABLE users (
-- 	id SERIAL PRIMARY KEY,
-- 	name TEXT NOT NULL,
-- 	email TEXT UNIQUE NOT NULL,
-- 	password TEXT NOT NULL,
-- 	age INT,
-- 	created_at TIMESTAMP default NOW()
-- );

-- CREATE TABLE orders(
-- 	id SERIAL PRIMARY KEY,
-- 	user_id INT REFERENCES users(id),
-- 	product_id INT REFERENCES products(id),
-- 	amount DECIMAL(10, 2),
-- 	ordered_at TIMESTAMP DEFAULT NOW()
-- );


-- INSERT INTO categories (name) VALUES 
-- ('Electronics'), ('Groceries'), ('Hardware'), ('Clothing'), 
-- ('Agriculture'), ('Furniture'), ('Stationery'), ('Health'), 
-- ('Automotive'), ('Toys');

-- INSERT INTO users (name, email, password, age) VALUES 
-- ('Limbani Phiri', 'limbani.phiri@example.mw', 'pass123', 28),
-- ('Kondwani Banda', 'kbanda@example.mw', 'pass123', 34),
-- ('Chifundo Mwale', 'chifundo.m@example.mw', 'pass123', 22),
-- ('Atusaye Nyasulu', 'atusaye.n@example.mw', 'pass123', 41),
-- ('Tiwonge Chirwa', 'tiwonge.c@example.mw', 'pass123', 26),
-- ('Memory Gondwe', 'memory.g@example.mw', 'pass123', 30),
-- ('Blessings Mtambo', 'blessings.m@example.mw', 'pass123', 19),
-- ('Tadala Kalua', 'tadala.k@example.mw', 'pass123', 25),
-- ('Wongani Kumwenda', 'wongani.k@example.mw', 'pass123', 37),
-- ('Eneless Tembo', 'eneless.t@example.mw', 'pass123', 29);


-- INSERT INTO products (name, category_id, in_stock, quantity) VALUES 
-- ('Smartphone', 1, true, 50),
-- ('Bag of Maize (50kg)', 5, true, 100),
-- ('Solar Panel 200W', 3, true, 15),
-- ('Cotton T-Shirt', 4, true, 200),
-- ('Wooden Dining Table', 6, false, 0),
-- ('Office Chair', 6, true, 12),
-- ('A4 Exercise Book', 7, true, 500),
-- ('Panado Tablets', 8, true, 1000),
-- ('Engine Oil 5L', 9, true, 25),
-- ('Football', 10, true, 40);


-- INSERT INTO orders (user_id, product_id, amount) VALUES 
-- (1, 1, 150000.00),
-- (2, 2, 25000.00),
-- (3, 7, 1200.00),
-- (4, 3, 85000.00),
-- (5, 4, 7500.00),
-- (6, 8, 500.00),
-- (7, 10, 15000.00),
-- (8, 2, 25000.00),
-- (9, 9, 35000.00),
-- (10, 1, 150000.00);




-- order id
-- user name
-- product name
-- category name
-- amount

-- SELECT 
-- 	o.id as order_id,
-- 	u.name as user_name, 
-- 	p.name as product_name, 
-- 	c.name as category_name,
-- 	o.amount
-- FROM orders o
-- JOIN users u ON u.id = o.user_id
-- JOIN products p ON p.id = o.product_id
-- JOIN categories c ON c.id = p.category_id








