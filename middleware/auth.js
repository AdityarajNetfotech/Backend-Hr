import ErrorResponse from '../utils/errorResponse.js';
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';


//user authentication
export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error){
        return next(new ErrorResponse('Not authorized to access this route', 401));

    }
}

//middleware for admin
export const isAdmin = (req, _res, next) => {
    if (req.user.role === "admin"){
        return next(new ErrorResponse('Access denied, you must be an admin', 401));
    }
    next();
}

//middleware for client
export const isClient = (req, _res, next) => {
    if (req.user.role === "client"){
        return next(new ErrorResponse('Access denied, you must be an client', 401));
    }
    next();
}

//middleware for recruiter
export const isRecruiter = (req, _res, next) => {
    if (req.user.role === "recruiter"){
        return next(new ErrorResponse('Access denied, you must be an recruiter', 401));
    }
    next();
}


export const protect = async (req, res, next) => {
    let token;
    console.log('Cookies:', req.cookies); // Log cookies
    console.log('Authorization Header:', req.headers.authorization); // Log header

    // Attempt to get token from cookies or headers
    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        console.log('No token found'); // Debug
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) {
            return next(new ErrorResponse('User not found', 404));
        }
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message); // Debug
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};
