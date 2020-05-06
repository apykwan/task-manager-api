const express = require('express');
const router = new express.Router();
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account.js');
const auth = require('../middleware/auth');
const User = require('../models/user');

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }

    /* use */
    // user.save()
    //     .then(_ => {
    //         res.send(user);
    //         console.log(user);
    //     })  
    //     .catch(err => {
    //         res.status(400).send(err);
    //         console.log(err.message);
    //     });
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token =>  token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

/* Read data */
router.get('/users/me', auth ,async (req, res) => {

    /* Log only the authenticated user */
    res.send(req.user);

    /* Log up all users */
    // try {
    //     const users = await User.find({});
    //     res.send(users);
    // } catch (error) {
    //     res.status(500).send(error);
    // };

    // User.find()
    //     .then(users => {
    //         res.send(users)
    //     })
    //     .catch(err => {
    //         res.status(500).send();
    //     })
});


/* Allow user to update by id */
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        // const user = await User.findById(req.params.id);
        const { user , body } = req;

        updates.forEach(update => req.user[update] = body[update]);

        await user.save();

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.send(user)
    } catch (error) {
        res.status(400).send(error);
    };
});

/* Removing an user */
router.delete('/users/me', auth, async (req, res) => {
    const { user } = req;
    try {
        // const user = await User.findByIdAndDelete(req.uer._id);
        // if (!user) {
        //     return res.status(404).send({ error: 'Cannot find by that particular id' });
        // }
        await user.remove();
        sendCancelEmail(user.email, user.name);
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

// Upload files using multer 
const upload = multer({
    /* where moulter used to store the file*/
    // dest: "avatars",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload image file!!'));
        };
        callback(undefined, true);
    }
});

/* Adding or Updating user's avatar */
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const { user, file } = req;
    // user.avatar = file.buffer;

    /* Using sharp package to reformat the image into smaller size & convert to png */
    const buffer = await sharp(file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    user.avatar = buffer;

    await user.save();

    res.send();
}, (error, req, res, next) => {
    res.status(400).send({error: error.message })
});

/* Deleting user's avatar */
router.delete('/users/me/avatar', auth, async (req, res) => {
    const { user } = req;

    if (!user.avatar) {
        return res.status(400).send('No avatar has been found!');
    }
    
    user.avatar = undefined;
    await user.save();
    res.send('the image has been deleted');
});

/* Upload the image to the front end */
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        };
        // set response header
        // show the converted image on browser
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
    }
});

module.exports = router;

/* Allow users to search by Id */
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error);
//     };

    // if (_id.length != 24) {
    //     res.status(404).send()
    // } else {
    //     User.findById(_id)
    //         .then((user) => {
    //             if (!user) {
    //                 return res.status(404).send()
    //             }
    //             res.send(user)
    //         })
    //         .catch((e) => {
    //             res.status(500).send(e)
    //         });
    // };
// });

/* User Schema */
// const me = new User({
//     name: '   Chunli  ',
//     email: 'mikDSDSe@SDSdSF.COM',
//     password: ' pfgfdsgfdsgfg '
// });

// me.save()
//     .then(_ => console.log(me))
//     .catch(error => console.log(error))
