import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';
import '../styles.css';

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get("http://localhost:8000/todos/");
    setTodos(response.data);
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <AddTodo onTodoAdded={fetchTodos} />
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onUpdate={fetchTodos} />
        ))}
      </div>
    </div>
  );
}