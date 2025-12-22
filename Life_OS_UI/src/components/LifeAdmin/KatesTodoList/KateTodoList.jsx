import React, { useState, useEffect } from 'react';
import './KateTodoList.css';

const KateTodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch todos from the backend API
    fetch('/api/todos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []); // The empty dependency array ensures this effect runs only once on mount

  return (
    <div className="kate-todo-list-container">
      <h2>Things to do with Kate</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.task}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default KateTodoList;
