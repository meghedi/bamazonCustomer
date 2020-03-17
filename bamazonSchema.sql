DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_id INT NOT NULL,
  price DECIMAL(10, 2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10, 2) NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products(product_name, department_id, price, stock_quantity)
VALUES ("pampers", 1 , 34.99, 10),("food storage", 2 , 8.99, 20), ("bath towel", 3 , 30, 5),
("drinkware", 4, 5, 2 ), ("table set", 2, 50, 20);

INSERT INTO departments(department_name, over_head_costs) 
VALUES ("baby", 1000), ("kitchen", 2000) , ("bath", 10), ("dining", 50);


SELECT * FROM products INNER JOIN departments ON products.department_id=departments.department_id; 