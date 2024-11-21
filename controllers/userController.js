 import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from 'bcrypt';
//load all users
export const allUsers = async (req, res, next) => {
    try {
        // Fetch all users, excluding the password field
        const users = await User.find().sort({ createdAt: -1 }).select('-password');

        // Send the fetched users in the response
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        // Log the error and pass it to the error-handling middleware
        console.error('Error fetching users:', error);
        next(error);
    }
};

//Show Single User
export const singleUser = async (req, res, next) =>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })
        next();
    }
    catch (error ){
        return next(error);
    }
}


//Edit User
export const editUser = async (req, res, next) =>{
    try{
        const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            user
        })
        next();
    }
    catch (error ){
        return next(error);
    }
}


//Delete User
export const deleteUser = async (req, res, next) =>{
    try{
        const user = await User.findByIdAndDelete( req.params.id );

        res.status(200).json({
            success: true,
            message: "User deleted"
        })
        next();
    }
    catch (error ){
        return next(error);
    }
}


//jd History
export const createUserJDsHistory = async (req, res, next) =>{
    const {title, description, salary, location} = req.body;

    try{
        const currentUser = await User.findOne( {_id: req.user._id} );
        if(!currentUser){
            return next(new ErrorResponse("You must Log In", 401));
        }
        else{
            const addJDHistory = {
                title, 
                description, 
                salary, 
                location, 
                user: req.user._id 
            }
            currentUser.jdsHistory.push(addJDHistory);
            await currentUser.save();
        }
        res.status(200).json({
            success: true,
            currentUser
        })
        next();
    }
    catch (error ){
        return next(error);
    }
}

