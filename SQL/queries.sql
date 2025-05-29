-- Top 5 customers by total spend
SELECT u.username, SUM(o.total) AS total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.username
ORDER BY total_spent DESC
LIMIT 5;
-- Products low on stock
SELECT name, stock, category
FROM products
WHERE stock < 10
ORDER BY stock ASC;

-- Monthly revenue report
SELECT
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS order_count,
    SUM(total) AS revenue
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month;

-- Most ordered products
SELECT p.name, SUM(oi.quantity) AS total_sold
FROM order_items oi
JOIN products p ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;
