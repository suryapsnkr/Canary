import { useState } from 'react';
import axios from 'axios';
import AddTodo from './AddTodo';

export default function TodoItem({ todo, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleComplete = async () => {
    await axios.put(`http://localhost:8000/todos/${todo.id}`, {
      ...todo,
      completed: !todo.completed,
    });
    onUpdate();
  };

  const deleteTodo = async () => {
    await axios.delete(`http://localhost:8000/todos/${todo.id}`);
    onUpdate();
  };

  if (isEditing) {
    return (
      <AddTodo
        initialTodo={todo}
        onTodoAdded={() => {
          onUpdate();
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
        />
        <div className="todo-text">
          <h3>{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button onClick={deleteTodo}>Delete</button>
      </div>
    </div>
  );
}