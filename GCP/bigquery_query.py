from google.cloud import bigquery
from datetime import datetime, timedelta

client = bigquery.Client(project="my-gcp-project")

def run_query(sql: str) -> list:
    job = client.query(sql)
    return [dict(row) for row in job.result()]

def get_top_products(days: int = 30, limit: int = 10) -> list:
    since = (datetime.utcnow() - timedelta(days=days)).strftime("%Y-%m-%d")

    sql = f"""
        SELECT
            product_id,
            product_name,
            SUM(quantity)  AS total_sold,
            SUM(revenue)   AS total_revenue
        FROM `my-gcp-project.analytics.sales`
        WHERE DATE(created_at) >= '{since}'
        GROUP BY product_id, product_name
        ORDER BY total_revenue DESC
        LIMIT {limit}
    """
    return run_query(sql)

def get_daily_active_users(days: int = 7) -> list:
    sql = f"""
        SELECT
            DATE(event_time) AS date,
            COUNT(DISTINCT user_id) AS dau
        FROM `my-gcp-project.analytics.events`
        WHERE DATE(event_time) >= DATE_SUB(CURRENT_DATE(), INTERVAL {days} DAY)
        GROUP BY date
        ORDER BY date
    """
    return run_query(sql)

if __name__ == "__main__":
    print("Top products:", get_top_products(30, 5))
    print("DAU:", get_daily_active_users(7))
