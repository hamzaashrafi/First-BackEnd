const express = require('express');
const router = express.Router();
let jwt = require('jsonwebtoken');
const User = require('../Models/User');
const config = require('config');

router.post('/createuser', async (req, res) => {
    const { email, password, user_name, mobileNumber, city, gender, address } = req.body;
    console.log(req.body);
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.json({ messege: 'Email is already exist', code: '001' });
        }
        if (email && password && user_name && address && mobileNumber) {
            user = new User({
                user_name: user_name,
                email: email,
                phone_number: mobileNumber,
                password: password,
                address: address,
                gender: gender ? gender : '',
                city: city ? city : '',
            });
            user.save()
                .then(responce => {
                    const payload = {
                        user: {
                            id: responce._id
                        }
                    };
                    jwt.sign(
                        payload,
                        config.get('jwtSecret'),
                        // { expiresIn: 36000 },
                        (err, token) => {
                            if (err) {
                                throw err;
                            } else {
                                res.json({ messege: 'User Created Successfully', userName: responce.user_name, token });
                            }
                        }
                    );
                }).catch(error => {
                    console.log(error);
                });
        } else {
            res.json({ messege: 'Required Fields are Missing', code: '002' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (email && password && user) {
            if (email === user.email && password === user.password) {
                const payload = {
                    user: {
                        id: user.id
                    }
                };
                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    // { expiresIn: 36000 },
                    (err, token) => {
                        if (err) {
                            throw err;
                        } else {
                            res.json({ messege: 'Login Succefull', token, userName: user.user_name });
                        }
                    }
                );
            } else {
                res.json({ messege: 'Invalid Email Or Password', code: '003' });
            }
        } else {
            res.json({ messege: 'Email & Password not Exist', code: '004' });
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/fetchuser', async (req, res) => {
    try {
        if (req.headers.authorization === null) {
            return res.json({ messege: 'User Not Found' });
        }
        const decode = jwt.verify(req.headers.authorization, config.jwtSecret);
        const id = decode.user.id;
        const dbuser = await User.findById(id).select('-password');
        if (!dbuser) {
            return res.json({ messege: 'User Not Found' });
            // return res.status(404).send('User Not Found');
        }
        res.json({ user: dbuser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;