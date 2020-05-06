const jwt = require('jsonwebtoken');
const User = require('../models/user');

/*  middle ware */
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.'})
    }
};

module.exports = auth;

/*  middle ware */
// Without middleware: new request => run route handler
// With middleware: new request => do somehting => run route handler
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disable');
//     } else 

//     next();
// });

// app.use((req, res, next) => {
//     res.status(503).send('Under Maintenance!!!!!')

// });