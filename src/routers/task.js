const express = require('express');
const router = new express.Router();

const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const { user, body } = req;
    
    const task = new Task({
        ...body,
        owner: user._id
    });

    try {
        const addedTask = await task.save();
        res.status(201).send(addedTask);
    } catch (error) {
        res.status(400).send(error);
    }
});

/* Read tasks */
// GET /task?completed=true
// GET /tasks?limit=10&skip=10   => goes to 2nd page loading 10 tasks
// GET /task?sortyBy=createdAt
router.get('/tasks', auth, async (req, res) => {
    try {
        /* By using find method */
        // const tasks = await Task.find({ owner: req.user._id });

        /* By using populate method  */
        const { user, query } = req;
        const match = {};
        const sort = {};

        if (query.completed) {
            match.completed = query.completed === 'true';
        };

        if (query.sortBy) {
            // split operator turn a string into an array
            const parts = query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1; 
        }

        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(query.limit),
                skip: parseInt(query.skip),
                sort
            }
        }).execPopulate();

        res.status(200).send(user.tasks);
    } catch (error) {
        res.status(500).send(error);
    };
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner: req.user._id });
        
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(500).send(error);
    };
});

/* Update task */
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isUpdateValid = updates.every(update => allowedUpdates.includes(update));

    if (!isUpdateValid) {
        return res.status(404).send({ error: 'invalid update!' });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        // const task = await Task.findById(req.params.id);

        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!task) {
            return res.status(404).send('cannot find the task');
        };

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);

    } catch (error) {
        res.status(404).send(error);
    };
});

router.delete('/tasks/:id', auth, async (req, res) => {
    const { params, user } = req;
    try {
        // const task = await Task.findByIdAndDelete(req.params.id);
        /* Alternative way to remove this specific task */
        // const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        const task = await Task.findOne({ _id: params.id, owner: user._id})
        if (!task) {
            return res.status(404).send({ error: 'No Matched Found!' });
        }
        await task.remove();
        res.send(`Deleted task: ${task}`)
    } catch (error) {
        res.status(500).send(error)
    }
});

module.exports = router;

/* Task Schema */
// const task = new Task({
//     description: 'Boxing'
// });

// task.save()
//     .then(_ => console.log(task))
//     .catch(err => console.log(err));