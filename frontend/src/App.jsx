import React, { useState, useEffect, useCallback } from 'react';
import TodoList from './components/TodoList';
import TodoInput from './components/TodoInput';
import todoApi from './services/api';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch todos from backend on mount
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError('Failed to load todos. Is the backend running?');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (text) => {
    if (text.trim()) {
      try {
        const newTodo = await todoApi.create(text);
        setTodos([newTodo, ...todos]);
      } catch (err) {
        setError('Failed to add todo');
        console.error('Add error:', err);
      }
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const updated = await todoApi.toggle(id, !todo.completed);
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError('Failed to update todo');
      console.error('Toggle error:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await todoApi.delete(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Delete error:', err);
    }
  };

  const clearCompleted = async () => {
    try {
      await todoApi.clearCompleted();
      setTodos(todos.filter((todo) => !todo.completed));
    } catch (err) {
      setError('Failed to clear completed todos');
      console.error('Clear error:', err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div className="app">
      <div className="background-decoration"></div>
      <main className="container">
        <header className="header">
          <h1 className="title">todos</h1>
          <p className="subtitle">Keep track of what matters</p>
        </header>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">×</button>
          </div>
        )}

        <TodoInput onAdd={addTodo} disabled={loading} />

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your todos...</p>
          </div>
        ) : (
          <>
            <div className="stats">
          <span className="stat">
            <span className="stat-number">{activeCount}</span> active
          </span>
          <span className="stat">
            <span className="stat-number">{completedCount}</span> done
          </span>
        </div>

        <div className="filters">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed tasks
          </button>
        )}

        {todos.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <p>Your list is empty</p>
            <span>Add a task to get started</span>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
