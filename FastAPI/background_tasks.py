from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import asyncio, logging

app = FastAPI()
logger = logging.getLogger(__name__)

class OrderRequest(BaseModel):
    user_email: str
    product_id: str
    quantity: int

async def send_confirmation_email(email: str, order_id: str):
    await asyncio.sleep(1)  # simulate SMTP delay
    logger.info(f"Confirmation sent to {email} for order {order_id}")

async def update_inventory(product_id: str, quantity: int):
    await asyncio.sleep(0.5)
    logger.info(f"Inventory updated: -{quantity} units for {product_id}")

async def log_analytics(event: dict):
    await asyncio.sleep(0.2)
    logger.info(f"Analytics: {event}")

@app.post("/orders", status_code=202)
async def place_order(order: OrderRequest, bg: BackgroundTasks):
    order_id = f"ORD-{order.product_id}-{int(asyncio.get_event_loop().time())}"
    bg.add_task(send_confirmation_email, order.user_email, order_id)
    bg.add_task(update_inventory, order.product_id, order.quantity)
    bg.add_task(log_analytics, {"event": "order_placed", "order_id": order_id})
    return {"order_id": order_id, "status": "accepted"}

