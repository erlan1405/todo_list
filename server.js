const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Task = require('./db/task.js');
const path = require('path');
const app = express();


// EJS settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.get('/', (req, res) => {
    res.render('index', {first_name: "Erlan"});
});

// Middleware conncection
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB connection
mongoose.connect('mongodb+srv://erlander5551:tYvPO2lhqR1SuiAB@cluster0.grlyi.mongodb.net/', {
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('Error connecting to MongoDB:', err));

// Upload all task
app.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Error fetching tasks');
    }
});

// Add a new task
app.post('/add', (req, res) => {
    const newTask = new Task({
        name: req.body.name
    });

    newTask.save()
        .then(() => {
            res.status(200).send('Task added');
        })
        .catch(err => {
            res.status(500).send('Error adding task');
        });
});

// Ubdate task
app.put('/update/:id', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, { name: req.body.name }, (err, task) => {
        if (err) {
            res.status(500).send('Error updating task');
        } else {
            res.status(200).send('Task updated');
        }
    });
});

// Delete task
app.delete('/delete/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            res.status(500).send('Error deleting task');
        } else {
            res.status(200).send('Task deleted');
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
