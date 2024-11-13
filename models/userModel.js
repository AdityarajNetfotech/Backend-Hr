import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
    },
    mobileNumber: {
        type: Number,
        required: [true, 'Phone no is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        unique: true,
        trim: true,
    },
    joinAs: {
        type: String,
        enum: ['recruiter', 'client', 'admin'],
        required: [true, 'JoinAs is required'],
        default: 'Select',
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
    },
    location: {
        type: String,
        enum: ['New York', 'Los Angeles', 'Chicago'],
        required: [true, 'Location is required'],
        default: 'Select',
        trim: true,
    },
    // jdHistorySchema: 
}, {timestamps: true});

// Encrypting the password
userSchema.pre('save', async function(next) {
        console.log("Here i am");
        
    if (!this.isModified('password')) {
        return next();  // Correctly handle the flow
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//return a JWT token
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id: this.id}, process.env.JWT_SECRET, {
        expiresIn: 3600
    });
}

const User = mongoose.model('User', userSchema);

export default User;