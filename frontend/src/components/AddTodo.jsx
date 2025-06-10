import { useState } from 'react';
import axios from 'axios';

export default function AddTodo({ initialTodo, onTodoAdded, onCancel }) {
  const [title, setTitle] = useState(initialTodo?.title || '');
  const [description, setDescription] = useState(initialTodo?.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialTodo?.id) {
      await axios.put(`http://localhost:8000/todos/${initialTodo.id}`, {
        title,
        description,
        completed: initialTodo.completed,
      });
    } else {
      await axios.post("http://localhost:8000/todos/", {
        title,
        description,
        completed: false,
      });
    }
    setTitle('');
    setDescription('');
    onTodoAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit">
          {initialTodo?.id ? 'Update Todo' : 'Add Todo'}
        </button>
      </div>
    </form>
  );
}