const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;


const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

connectDB(); // Ensure to call the connectDB function to establish the connection

module.exports = mongoose; // Export mongoose object after connection
