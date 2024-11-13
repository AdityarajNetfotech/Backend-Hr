import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import UserOTPVerification from '../models/UserOTPVerification.js'
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import bcrypt from 'bcrypt'
import express from 'express';
const router = express.Router();



//user signup
export const signup = async (req, res, next) => {
    try {
        const signupForm = req.body;
        
        const { firstName, lastName, email, mobileNumber, joinAs, location, password } = signupForm;

        console.log(firstName, lastName, email, mobileNumber, joinAs, location, password);
        
        
        const requiredFields = [ firstName, lastName, email, mobileNumber, joinAs, location, password ]

        if (requiredFields.some(field => !field)) {
            return next(new ErrorResponse("Please enter all required fields", 400));
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorResponse("Email already Registered", 400));
        }


            console.log("I am here");
            
        
        // Create a new user
        const user = await User.create({
            firstName: firstName,
            lastName: lastName,
            mobileNumber: mobileNumber,
            email: email,
            joinAs: joinAs,
            location: location,
            password: password
        });

        console.log("User Created");
        

        // Send OTP verification email
        await sendOTPVerificationEmail(user, res);

        // Respond with success
        res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            user
        });

    } catch (error) {
        next(error);
    }
}

//user signin
export const signin = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            return next(new ErrorResponse("Please add an email", 403));
        }
        if (!password) {
            return next(new ErrorResponse("Please add a valid password", 403));
        }

        //check user email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Invalid Credentials", 400));
        }
        //check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("Invalid Credentials", 400));
        }

        sendTokenResponse(user, 200, res);
        console.log(user);
        

    } catch (error) {
        next(error);
    }
}

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    console.log('Generated Token:', token); // Debug log for token creation

    res.status(codeStatus)
        .cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None', // Adjust as needed
            secure: false, // Ensure false for development
        })
        .json({ success: true, userId: user._id, role: user.role });
};


//log out
export const logout = (_req, res, _next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out"
    })
}

//User Profile
export const userProfile = async (req, res, _next) => {

    const user = await User.findById(req.user.id).select('-password')

    res.status(200).json({
        success: true,
        user
    })
}

// Get logged-in user's profile
export const getUserProfile = async (req, res, next) => {
    try {
        // Assuming userId is stored in req.user from the authentication middleware
        const user = await User.findById(req.user.id).select('-password'); // Exclude password from response

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};


export const sendOTPVerificationEmail = async (user, res) => {
    try {
        // Email configuration
        let config = {
            service: 'gmail',
            auth: {
                user: 'aditya@netfotech.in',
                pass: 'uqznqhrpowczgpxh'
            }
        };
        const transporter = nodemailer.createTransport(config);

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000); 
        const otpString = otp.toString();
        const mailOptions = {
            from: 'Aditya@netfotech.in',
            to: user.email,
            subject: "Verify Your Email",
            html: `<p>Enter ${otpString} on the website to verify your email address and complete the signup process.</p>`
        };

        // Hash the OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otpString, saltRounds);

        // Save the OTP record
        const newOTPVerification = new UserOTPVerification({
            userId: user._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000, // OTP valid for 1 hour
        });
        await newOTPVerification.save();

        // Send the OTP email
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error("Error sending OTP verification email:", error);
        res.json({
            status: "FAILED",
            message: "Error in sending verification email."
        });
        throw error; // Optionally rethrow the error if you want to handle it at a higher level
    }
}



export const getProfile = async (req, res) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Authorization denied: No token provided' });
        }

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find user by ID
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user data as response
        res.status(200).json({ user });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};