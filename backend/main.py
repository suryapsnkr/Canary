# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite setup
conn = sqlite3.connect("todos.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL CHECK (completed IN (0, 1))
    )
''')
conn.commit()

# Pydantic models
class Todo(BaseModel):
    id: int
    title: str
    description: str
    completed: bool

class TodoCreate(BaseModel):
    title: str
    description: str
    completed: bool = False

class TodoUpdate(BaseModel):
    title: str
    description: str
    completed: bool

# Routes
@app.get("/todos", response_model=List[Todo])
def get_todos():
    cursor.execute("SELECT * FROM todos")
    rows = cursor.fetchall()
    return [Todo(id=row[0], title=row[1], description=row[2], completed=bool(row[3])) for row in rows]

@app.post("/todos", response_model=Todo)
def create_todo(todo: TodoCreate):
    cursor.execute("INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)",
                   (todo.title, todo.description, int(todo.completed)))
    conn.commit()
    todo_id = cursor.lastrowid
    return Todo(id=todo_id, **todo.dict())

@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, todo: TodoUpdate):
    cursor.execute("SELECT * FROM todos WHERE id = ?", (todo_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Todo not found")

    cursor.execute("UPDATE todos SET title = ?, description = ?, completed = ? WHERE id = ?",
                   (todo.title, todo.description, int(todo.completed), todo_id))
    conn.commit()
    return Todo(id=todo_id, **todo.dict())

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    cursor.execute("SELECT * FROM todos WHERE id = ?", (todo_id,))
    if cursor.fetchone() is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    cursor.execute("DELETE FROM todos WHERE id = ?", (todo_id,))
    conn.commit()
    return {"detail": "Todo deleted"}
