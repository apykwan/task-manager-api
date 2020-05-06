const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json(), userRouter, taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port: ${port}`);
});

/* connecting two collections */
// const Task = require('./models/task');
// const User = require('./models/user');

// const main = async () => {
//     // const task = await Task.findById('5eadf36ec7069f465c050548');
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner);

//     const user = await User.findById('5eadf223521ab723600fe7a1');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// main();

// const bcrypt = require('bcryptjs');

// const myFunction = async () => {
//     const password = 'Red12345!';
//     const hashedPassword = await bcrypt.hash(password, 8);

//     console.log(password);
//     console.log(hashedPassword);

//     const isMatch = await bcrypt.compare('Red12345!', hashedPassword);
//     console.log(isMatch);
// };

// myFunction();

// const jwt = require('jsonwebtoken');

// const myFunction = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '10 seconds'});
//     console.log(token);

//     const data = jwt.verify(token, 'thisismynewcourse');
//     console.log(data);
// };

// myFunction();

/* toJSON demo */
// const pet = {
//     name: 'Hal',
//     age: 27
// }
// pet.owner = 'Andrew Meat';
// pet.toJSON = function () {
//     delete this.owner;
//     return {};
// }
// console.log("Console.log: ",pet);
// console.log(JSON.stringify(pet));

/* Use npm package multer to upload files including doc, jpg etc */
// const multer = require('multer');
// const upload = multer({
//     dest: 'images',
//     fileFilter(req, file, callback) {
//         if (!file.originalname.match(/\.(doc|docx)$/)) {
//             return callback(new Error('Please upload a word document!!'));
//         };
//         callback(undefined, true);
//     }
// });

// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send();
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
// });