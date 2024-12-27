import express from 'express';
import User from '../models/userModel.js';
import { getProfile, getUserProfile, googleSignIn, logout, signin, signup, userProfile } from "../controllers/authController.js";
import { isAuthenticated, protect } from '../middleware/auth.js';
import UserOTPVerification from '../models/UserOTPVerification.js'; // Import your model
import bcrypt from 'bcrypt'; // Import bcrypt for OTP comparison

const router = express.Router();

// User routes
// POST /api/signup
router.post("/google-signin", googleSignIn);

router.post("/signup", signup);

// POST /api/signin
router.post('/signin', signin);

// GET /api/logout
router.get('/logout', logout);

// GET /api/me
router.get('/me', protect, userProfile);

// GET /api/me
router.get('/memyprofile', protect, getUserProfile);


router.get('/memyprofile', getProfile);

// POST /api/verifyOTP
router.post("/verifyOTP", async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            throw new Error("Empty OTP or userId are not allowed");
        }

        // Find OTP verification records for the user
        const userOTPVerificationRecords = await UserOTPVerification.find({ userId });

        if (userOTPVerificationRecords.length <= 0) {
            throw new Error("Account record doesn't exist or has been verified already.");
        }

        const { expiresAt, otp: hashedOTP } = userOTPVerificationRecords[0];

        if (expiresAt < Date.now()) {
            // OTP has expired
            await UserOTPVerification.deleteMany({ userId });
            throw new Error("Code has expired. Please request again.");
        } else {
            const validOTP = await bcrypt.compare(otp, hashedOTP);

            if (!validOTP) {
                throw new Error("Invalid code. Check your inbox.");
            } else {
                // OTP is valid
                await User.updateOne({ _id: userId }, { verified: true });
                await UserOTPVerification.deleteMany({ userId });

                res.json({
                    status: "Verified",
                    message: "User email verified successfully."
                });
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
});

export default router;
