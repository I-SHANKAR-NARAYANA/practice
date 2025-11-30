from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Practice API", version="1.0.0")

class UserCreate(BaseModel):
    name: str
    email: str

class User(UserCreate):
    id: int

users_db: List[User] = []
counter = 1

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/users", response_model=List[User])
async def list_users():
    return users_db

@app.post("/users", response_model=User, status_code=201)
async def create_user(user: UserCreate):
    global counter
    new_user = User(id=counter, **user.dict())
    counter += 1
    users_db.append(new_user)
    return new_user

@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    user = next((u for u in users_db if u.id == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: int):
    global users_db
    if not any(u.id == user_id for u in users_db):
        raise HTTPException(status_code=404, detail="User not found")
    users_db = [u for u in users_db if u.id != user_id]
