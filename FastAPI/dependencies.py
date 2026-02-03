from fastapi import Depends, HTTPException, Header
from functools import lru_cache


from typing import Optional
import time

class Settings:
    app_name: str    = "Practice API"
    secret_token: str = "mysecret123"
    rate_limit: int  = 30  # requests per minute


@lru_cache()
def get_settings() -> Settings:
    return Settings()

async def verify_token(
    authorization: Optional[str] = Header(None),
    settings: Settings = Depends(get_settings),
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed token")
    token = authorization.split(" ")[1]
    if token != settings.secret_token:
        raise HTTPException(status_code=403, detail="Invalid token")
    return {"authenticated": True}

_request_log: dict = {}

async def rate_limit_check(

    client_id: Optional[str] = Header(None),
    settings: Settings = Depends(get_settings),
):
    key = client_id or "anonymous"
    bucket = int(time.time() // 60)
    _request_log.setdefault((key, bucket), 0)
    _request_log[(key, bucket)] += 1
    if _request_log[(key, bucket)] > settings.rate_limit:

        raise HTTPException(status_code=429, detail="Rate limit exceeded")
# reviewed


