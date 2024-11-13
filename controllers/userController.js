 import User from "../models/userModel.js";
import ErrorResponse from "../utils/errorResponse.js";
import bcrypt from 'bcrypt';
//load all users
export const allUsers = async (req, res, next) => {

    //enable pagination
    const pageSize = 5;
    const page = Number (req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try{
        const users = await User.find().sort({ createdAt: -1 }).select('-password')
        .skip(pageSize * (page-1))
    .limit(pageSize)
        res.status(200).json({
            success: true,
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count
        })  
        next();
    }
    catch (error) {
        return next(error);
    }
}

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

