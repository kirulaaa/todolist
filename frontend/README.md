# Todo List Frontend

A clean, elegant React to-do list application with a modern dark theme.

## Features

- Add, complete, and delete tasks
- Filter tasks by status (all, active, completed)
- Responsive design
- Smooth animations
- Connects to [todo-backend](https://github.com/your-username/todo-backend) API

## Project Structure

```
todo-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TodoInput.jsx
│   │   ├── TodoItem.jsx
│   │   └── TodoList.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **todo-backend** running on port 3001

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/todo-frontend.git
cd todo-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API URL (optional)

By default, the app connects to `http://localhost:3001/api`. To change this, create a `.env` file:

```
REACT_APP_API_URL=http://your-backend-url/api
```

### 4. Start the development server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

> **Note**: Make sure the backend is running first, or you'll see an error message.

## Usage

1. **Add a task**: Type in the input field and press Enter or click the + button
2. **Complete a task**: Click the circle checkbox on the left
3. **Delete a task**: Hover over a task and click the × button
4. **Filter tasks**: Use the filter buttons (all, active, completed)
5. **Clear completed**: Click "Clear completed tasks" to remove all done items

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Related

- [todo-backend](https://github.com/your-username/todo-backend) - The backend API for this application

## Technologies Used

- React 18
- CSS3 with CSS Variables
- Fetch API for HTTP requests
