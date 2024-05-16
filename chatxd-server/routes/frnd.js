const express = require('express');

const Frnd = require('../models/frnds');
const User = require('../models/users');

const router = express.Router();

router.post('/updateFRStatus', async (req, res) => {
    try {
        const { fromID, toID, status } = req.body;

        const fromData = await Frnd.findOne({ userPhone: fromID });
        const toData = await Frnd.findOne({ userPhone: toID });

        if (fromData && toData) {
            if (fromData.frndList.toID) {
                res.status(200).json({ error: 'Already you are friends.' });
                return;
            }
            fromData.frndList[toID] = {
                userPhone: toID,
                userName: toData.userName,
                status: status
            };
            const fromSuccess = await Frnd.findOneAndUpdate({ userPhone: fromID }, { frndList: fromData.frndList });
            toData.frndList[fromID] = {
                userPhone: fromID,
                userName: fromData.userName,
                status: status
            };
            const toSuccess = await Frnd.findOneAndUpdate({  userPhone: toID }, { frndList: toData.frndList });
            if (fromSuccess && toSuccess) {
                res.status(200).json({ msg: (status == 'pending' ? 'FR sent successfully.' : 'FR Updated successfully.') });
            } else {
                res.status(500).json({ error: 'FR failed due to Internal Error.' });
            }
        } else {
            res.status(400).json({ error: 'FR Failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'FR failed due to Internal Error.' });
    }
})

router.post('/getContacts', async (req, res) => {
    try {
        const userData = req.body;

        const resData = await Frnd.findOne({ userPhone: userData.userPhone });

        const idList = Object.keys(resData.frndList).filter((key) => {
            return resData.frndList[key].status == 'accept';
        })
        
        const contactList = idList.map((id) => {
            return resData.frndList[id]
        })

        res.status(200).json({ contactList: contactList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch Contact List' });
    }
})

router.post('/getFRs', async (req, res) => {
    try {
        const userData = req.body;

        const resData = await Frnd.findOne({ userPhone: userData.userPhone });

        const idList = Object.keys(resData.frndList).filter((key) => {
            return resData.frndList[key].status == 'pending';
        })
        
        const contactList = idList.map((id) => {
            return resData.frndList[id]
        })

        res.status(200).json({ contactList: contactList });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch Contact List' });
    }
})

router.post('/getUserData', async (req, res) => {
    try {
        const userPhone = req.body.userPhone;

        const resData = await User.findOne({ userPhone: userPhone });

        const userData = {
            userPhone: resData.userPhone,
            userName: resData.userName
        }

        res.status(200).json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch User Details' });
    }
})

router.post('/removeFrnd', async (req, res) => {
    try {
        const { fromID, toID } = req.body;

        const fromData = await Frnd.findOne({ userPhone: fromID });
        const toData = await Frnd.findOne({ userPhone: toID });

        delete fromData.frndList[toID];
        const fromSuccess = await Frnd.findOneAndUpdate({ userPhone: fromID }, { frndList: fromData.frndList });
        
        delete toData.frndList[fromID];
        const toSuccess = await Frnd.findOneAndUpdate({  userPhone: toID }, { frndList: toData.frndList });
        
        if (fromSuccess && toSuccess) {
            res.status(200).json({ msg: 'Unfriended successfully.' });
        } else {
            res.status(500).json({ error: 'FR failed due to Internal Error.' });
        }
    } catch (err) {
        res.status(400).json({ error: 'FR Failed' });
    }
})

module.exports = router;