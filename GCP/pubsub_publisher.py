from google.cloud import pubsub_v1
from datetime import datetime
import json

PROJECT_ID = "my-gcp-project"
TOPIC_ID   = "user-events"
publisher  = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(PROJECT_ID, TOPIC_ID)


def publish_event(event_type: str, data: dict) -> str:
    payload = {
        "event_type": event_type,
        "timestamp":  datetime.utcnow().isoformat(),

        "data":       data,
    }
    message = json.dumps(payload).encode("utf-8")
    future = publisher.publish(topic_path, message, event_type=event_type)
    msg_id = future.result()
    print(f"Published [{event_type}] message_id={msg_id}")

    return msg_id

def publish_batch(events: list) -> None:
    futures = [
        publisher.publish(topic_path, json.dumps(e).encode("utf-8"))
        for e in events
    ]
    ids = [f.result() for f in futures]
    print(f"Batch: published {len(ids)} messages")

if __name__ == "__main__":
    publish_event("user.signup",  {"user_id": "u123", "email": "test@example.com"})
    publish_event("order.placed", {"order_id": "o456", "amount": 99.99})
    publish_batch([{"id": "e1", "type": "click"}, {"id": "e2", "type": "view"}])


