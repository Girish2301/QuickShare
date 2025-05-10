const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");
        
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });
        
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });
        
    } catch (e) {
        console.error("MongoDB connection failed:", e);
        process.exit(1); // Exit with error code when connection fails
    }
};

module.exports = connectDB;