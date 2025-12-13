const API_URL = process.env.REACT_APP_API_URL || 'https://3773kqautqyyrf677db62wyf6u0udrjo.lambda-url.ap-southeast-1.on.aws/api';

export const todoApi = {
  // Get all todos
  async getAll() {
    const response = await fetch(`${API_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  // Create a new todo
  async create(text) {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  // Toggle todo completion
  async toggle(id, completed) {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });
    if (!response.ok) {
      throw new Error('Failed to update todo');
    }
    return response.json();
  },

  // Delete a single todo
  async delete(id) {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    return response.json();
  },

  // Delete all completed todos
  async clearCompleted() {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to clear completed todos');
    }
    return response.json();
  },
};

export default todoApi;
