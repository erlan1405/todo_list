const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Todo = require('./models/Todo');
const app = express();

// Connect to mongoDB
mongoose.connect('mongodb+srv://erlander5551:tYvPO2lhqR1SuiAB@cluster0.grlyi.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// EJS settings
app.set('view engine', 'ejs');
app.set('views', './views');

// Static file for CSS
app.use(express.static('public'));

// body-parser for POST-request
app.use(bodyParser.urlencoded({ extended: true }));

// Get all task
app.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.render('index', { todos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving todos');
  }
});

// Add new task
app.post('/add', async (req, res) => {
  const { title } = req.body;
  const newTodo = new Todo({
    title
  });
  try {
    await newTodo.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding todo');
  }
});

// Delete task
app.post('/delete/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting todo');
  }
});

// Update task
app.post('/complete/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating todo');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
