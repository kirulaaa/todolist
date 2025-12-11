import React, { useState } from 'react';

function TodoInput({ onAdd, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onAdd(value);
      setValue('');
    }
  };

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button type="submit" className="add-btn" disabled={!value.trim() || disabled}>
        <span className="add-icon">+</span>
      </button>
    </form>
  );
}

export default TodoInput;
