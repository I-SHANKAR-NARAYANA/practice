-- E-commerce schema practice

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    username   VARCHAR(50)  UNIQUE NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    price    DECIMAL(10,2) NOT NULL,
    stock    INT DEFAULT 0,
    category VARCHAR(50)
);

CREATE TABLE orders (
    id         SERIAL PRIMARY KEY,

    user_id    INT REFERENCES users(id) ON DELETE CASCADE,
    total      DECIMAL(10,2) NOT NULL,
    status     VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity   INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_products_category ON products(category);
