const express = require('express');
const { readFile, writeFile } = require('fs').promises;
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

const getList = async () => {
    try {
        const data = await readFile('./list.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading list:', error);
        return [];
    }
};

const saveList = async (list) => {
    try {
        await writeFile('./list.json', JSON.stringify(list, null, 2));
        console.log('List updated successfully.');
    } catch (error) {
        console.error('Error writing list:', error);
    }
};

// Get all tasks
app.get('/tasks', async (req, res) => {
    const list = await getList();
    res.json(list);
});

// Add a new task
app.post('/tasks', async (req, res) => {
    const list = await getList();
    const newTask = req.body;
    list.push(newTask);
    await saveList(list);
    res.json({ message: 'Task added successfully', task: newTask });
});

// Update a task (mark as done/undone)
app.patch('/tasks/:id', async (req, res) => {
    const list = await getList();
    const taskId = req.params.id;
    const updatedTask = req.body;

    const taskIndex = list.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        list[taskIndex] = { ...list[taskIndex], ...updatedTask };
        await saveList(list);
        res.json({ message: 'Task updated successfully', task: list[taskIndex] });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const list = await getList();
    const taskId = req.params.id;

    const updatedList = list.filter(task => task.id !== taskId);
    if (updatedList.length !== list.length) {
        await saveList(updatedList);
        res.json({ message: 'Task deleted successfully' });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});