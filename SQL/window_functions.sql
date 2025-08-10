-- Running total of revenue per month
SELECT
    DATE_TRUNC('month', created_at) AS month,
    SUM(total) AS monthly_revenue,
    SUM(SUM(total)) OVER (
        ORDER BY DATE_TRUNC('month', created_at)
    ) AS running_total
FROM orders
WHERE status = 'completed'
GROUP BY month
ORDER BY month;

-- Rank products within category by revenue
SELECT
    p.name,
    p.category,
    SUM(oi.quantity * oi.unit_price) AS revenue,
    RANK() OVER (
        PARTITION BY p.category
        ORDER BY SUM(oi.quantity * oi.unit_price) DESC
    ) AS rank_in_category
FROM products p
JOIN order_items oi ON p.id = oi.product_id
GROUP BY p.id, p.name, p.category;

-- Days between consecutive orders per customer
SELECT
    user_id,
    created_at,
    LAG(created_at) OVER (PARTITION BY user_id ORDER BY created_at) AS prev_order,
    created_at - LAG(created_at) OVER (
        PARTITION BY user_id ORDER BY created_at
    ) AS gap
FROM orders;
