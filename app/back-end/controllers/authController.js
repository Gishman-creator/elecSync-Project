const User = require('../models/userModel');

exports.signup = async (req, res) => {
    const { email, phone, meterId } = req.body;

    try {
        // Check if email already exists
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email already exists'
            });
        }

        // Check if phone number already exists
        const existingUserByPhone = await User.findOne({ phone });
        if (existingUserByPhone) {
            return res.status(400).json({
                status: 'fail',
                message: 'Phone number already exists'
            });
        }

        // Check if meter ID already exists
        const existingUserByMeterId = await User.findOne({ meterId });
        if (existingUserByMeterId) {
            return res.status(400).json({
                status: 'fail',
                message: 'Electric meter ID already exists'
            });
        }

        // Create new user
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log()

    if (!email || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email and password'
        });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || password !== user.password) {
            return res.status(401).json({
                status: 'fail',
                message: 'Incorrect email or password'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
