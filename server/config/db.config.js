const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected`)
    } catch (error) {
        console.log(`MongoDb not connected because of Error => `, error);
    }
}


module.exports = connectDB;