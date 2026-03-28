const express = require('express');
const app = express();
app.use(express.json());  

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// 1. GET ALL - Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

 
app.get('/todos/active', (req, res) => {
  const activeTodos = todos.filter((t) => t.completed === false);
  res.status(200).json(activeTodos);
});

// 3. TASK: GET /todos/:id - Single Read
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.status(200).json(todo);
});

// 4. TASK: POST New with Validation
app.post('/todos', (req, res) => {
  // Check if "task" field exists in the request body
  if (!req.body.task) {
    return res.status(400).json({ error: 'Validation failed: "task" field is required' });
  }

  const newTodo = { 
    id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1, 
    task: req.body.task,
    completed: req.body.completed || false 
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 5. PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  
  Object.assign(todo, req.body);
  res.status(200).json(todo);
});

// 6. DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const exists = todos.find(t => t.id === id);
  
  if (!exists) return res.status(404).json({ error: 'Not found' });
  
  todos = todos.filter((t) => t.id !== id);
  res.status(204).send(); 
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));