const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, { dbName: 'chatXD' });
        console.log('Db Connection - Successfull.');
        return true;
    } catch (err) {
        console.log(err);
        console.log('Db Connection - Failed.');
        return false;
    }
}

module.exports = connectDb;