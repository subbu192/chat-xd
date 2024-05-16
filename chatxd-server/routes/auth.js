const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');

const User = require('../models/users');
const Frnd = require('../models/frnds');

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const givenData = req.body;

        const userData = await User.findOne({ userPhone: givenData.userPhone });

        if (userData) {
            const verified = await bcrypt.compare(givenData.userPass, userData.userPass);

            const userID = {
                userName: userData.userName,
                userPhone: userData.userPhone
            }

            const jwtToken = jwt.sign(JSON.stringify(userID), process.env.JWT_SECRET);

            if (verified) {
                res.status(200).json({ userData: userID, token: jwtToken });
            } else {
                res.status(401).json({ error: 'Incorrect Password' });
            }
        } else {
            res.status(404).json({ error: 'User Not Found.' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Login failed due to Internal Error.' });
    }
})

router.post('/register', async (req, res) => {
    try {
        const hashedPass = await bcrypt.hash(req.body.userPass, 10);

        const givenData = req.body;
        givenData.userPass = hashedPass;

        const userData = await User.findOne({ userPhone: givenData.userPhone });
        if (userData) {
            res.status(400).json({ error: 'User with given phone number already exists.' });
        }

        const newUser = new User(givenData);

        const registered = await newUser.save();

        if (registered) {
            const frndData = new Frnd({
                userPhone: givenData.userPhone,
                userName: givenData.userName,
                frndList: {}
            })

            const addedFrndData = await frndData.save();
            if (addedFrndData) {
                console.log('Added Frnd Data');
            } else {
                console.log('Failed to add Frnd Data');
            }

            const userID = {
                userName: givenData.userName,
                userPhone: givenData.userPhone
            }

            const jwtToken = jwt.sign(JSON.stringify(userID), process.env.JWT_SECRET);

            res.status(200).json({ msg: 'Registration Success.', userData: userID, token: jwtToken });
        } else {
            res.status(400).json({ error: 'Registration Failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed due to Internal Error.' });
    }
})

router.post('/verify', async (req, res) => {
    try {
        const jwtToken = req.body.jwtToken;
        const userData = req.body.userData;

        const decoded = JSON.stringify(jwt.verify(jwtToken, process.env.JWT_SECRET));

        if (decoded == userData) {
            res.status(200).json({ msg: 'Verification Success.' });
        } else {
            res.status(401).json({ msg: 'Verification Failure.' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Verification Failure.' });
    }
})

router.post('/getuser', async (req, res) => {
    try {
        const givenPhone = req.body.userPhone;

        const userData = await User.findOne({ userPhone: givenPhone });

        if (userData) {
            const userData = {
                userName: userData.userName,
                userPhone: userData.userPhone
            }

            res.status(200).json({ userData: userData });
        } else {
            res.status(404).json({ msg: 'User not Found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'User Retrieval failed due to internal server error.' });
    }
})

module.exports = router;