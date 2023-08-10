
const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const User = require('./models/RegisterUser');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const multer = require('multer');
const fs = require('fs');
const Post = require('./models/Post');
const News = require('./models/News');
const Event = require('./models/Event');

var salt = bcrypt.genSaltSync(10);
var secret = bcrypt.genSaltSync(10);

const app = express();
app.use(cors({
    credentials: true,
    method: ["POST", "GET", "PUT"],
    origin: ["https://outer-space-psi.vercel.app"] //no end slash
})); //if set credentials, cors must have more information 
app.use(express.json());
app.use(cookieParser());
const uploadMiddleware = multer({ dest: 'uploads/' })
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://lunah:lunah@cluster0.ytcukbu.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        app.post('/register', async (req, res) => {
            const { username, password } = req.body;
            try {
                const userDoc = await User.create({
                    username,
                    password: bcrypt.hashSync(password, salt),
                });
                res.json(userDoc);
            } catch (e) {
                res.status(400).json(e);
            }

        });

        app.post('/login', async (req, res) => {
            const { username, password } = req.body;
            const userDoc = await User.findOne({ username });
            const passOk = bcrypt.compareSync(password, userDoc.password);
            if (passOk) {
                jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token).json({
                        id: userDoc._id,
                        username,
                    });
                });
            } else {
                res.status(400).json('wrong credentials')
            }

        });

        app.get('/profile', (req, res) => {
            const { token } = req.cookies;
            jwt.verify(token, secret, {}, (err, info) => {
                if (err) throw err;
                res.json(info);
            });
        });

        app.post('/logout', (req, res) => {
            res.cookie('token', '').json('ok');
        });

        app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);

            const { token } = req.cookies;
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { title, summary, content } = req.body;
                const postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id,
                });
                res.json(postDoc);
            });

        });

        app.post('/news', uploadMiddleware.single('file'), async (req, res) => {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);

            const { token } = req.cookies;
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { title, summary, content } = req.body;
                const newsDoc = await News.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id,
                });
                res.json(newsDoc);
            });

        });

        app.post('/event', uploadMiddleware.single('file'), async (req, res) => {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;
            fs.renameSync(path, newPath);

            const { token } = req.cookies;
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { title, summary, content } = req.body;
                const eventDoc = await Event.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id,
                });
                res.json(eventDoc);
            });

        });

        app.get('/post', async (req, res) => {
            res.json(
                await Post.find()
                    .populate('author', ['username'])
                    .sort({ createdAt: -1 })
                    .limit(4)
            );
        });

        app.get('/news', async (req, res) => {
            res.json(
                await News.find()
                    .populate('author', ['username'])
                    .sort({ createdAt: -1 })
                    .limit(4)
            );
        });

        app.get('/event', async (req, res) => {
            res.json(
                await Event.find()
                    .populate('author', ['username'])
                    .sort({ createdAt: -1 })
                    .limit(4)
            );
        });

        app.get('/post/:id', async (req, res) => {
            const { id } = req.params;
            const postDoc = await Post.findById(id).populate('author', ['username']);
            res.json(postDoc);
        })

        app.get('/news/:id', async (req, res) => {
            const { id } = req.params;
            const newsDoc = await News.findById(id).populate('author', ['username']);
            res.json(newsDoc);
        })

        app.get('/event/:id', async (req, res) => {
            const { id } = req.params;
            const newsDoc = await Event.findById(id).populate('author', ['username']);
            res.json(newsDoc);
        })

        app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
            let newPath = null;
            if (req.file) {
                const { originalname, path } = req.file;
                const parts = originalname.split('.');
                const ext = parts[parts.length - 1];
                newPath = path + '.' + ext;
                fs.renameSync(path, newPath);
            }

            console.log("[INFO]1");

            const { token } = req.cookies;
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { id, title, summary, content } = req.body;
                const postDoc = await Post.findById(id);
                console.log("[INFO] 2");
                console.log("[INFO]3" + postDoc.author + 'abc' + info.id);
                const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
                if (!isAuthor) {
                    return res.status(400).json('you are not the author');
                }

                console.log("[INFO]4")

                await postDoc.updateOne({
                    title,
                    summary,
                    content,
                    cover: newPath ? newPath : postDoc.cover,
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Result :", result)
                    }
                });

                console.log("[INFO]5");
                res.json(postDoc);
            });

        });

        app.put('/event', uploadMiddleware.single('file'), async (req, res) => {
            let newPath = null;
            if (req.file) {
                const { originalname, path } = req.file;
                const parts = originalname.split('.');
                const ext = parts[parts.length - 1];
                newPath = path + '.' + ext;
                fs.renameSync(path, newPath);
            }

            console.log("[INFO]1");

            const { token } = req.cookies;
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { id, title, summary, content } = req.body;
                const eventDoc = await Event.findById(id);
                console.log("[INFO] 2");
                console.log("[INFO]3" + eventDoc.author + 'abc' + info.id);
                const isAuthor = JSON.stringify(eventDoc.author) === JSON.stringify(info.id);
                if (!isAuthor) {
                    return res.status(400).json('you are not the author');
                }

                console.log("[INFO]4")

                await eventDoc.updateOne({
                    title,
                    summary,
                    content,
                    cover: newPath ? newPath : eventDoc.cover,
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Result :", result)
                    }
                });

                console.log("[INFO]5");
                res.json(eventDoc);
            });

        });

        app.put('/news', uploadMiddleware.single('file'), async (req, res) => {
            let newPath = null;
            if (req.file) {
                const { originalname, path } = req.file;
                const parts = originalname.split('.');
                const ext = parts[parts.length - 1];
                newPath = path + '.' + ext;
                fs.renameSync(path, newPath);
            }

            console.log("[INFO]1");

            const { token } = req.cookies;
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { id, title, summary, content } = req.body;
                const newsDoc = await News.findById(id);
                console.log("[INFO] 2");
                console.log("[INFO]3" + newsDoc.author + 'abc' + info.id);
                const isAuthor = JSON.stringify(newsDoc.author) === JSON.stringify(info.id);
                if (!isAuthor) {
                    return res.status(400).json('you are not the author');
                }

                console.log("[INFO]4")

                await newsDoc.updateOne({
                    title,
                    summary,
                    content,
                    cover: newPath ? newPath : newsDoc.cover,
                }, function (err, result) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("Result :", result)
                    }
                });

                console.log("[INFO]5");
                res.json(newsDoc);
            });

        });

        app.get('/', (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
            res.send('hello-outer-space-api');
        })

        app.get('/ping', (req, res) => {
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
            res.send('pong');
        })

        const port = process.env.PORT || 8000

        app.listen(port, (err, res) => {
            if (err) {
                console.log(err)
                return res.status(500).send(err.message)
            } else {
                console.log('[INFO] Server Running on port:', port)
            }
        })
    })


