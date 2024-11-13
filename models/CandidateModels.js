import mongoose from 'mongoose';
import validator from 'validator';
 
const ExperienceSchema = new mongoose.Schema({
    Job_title: {
        type: String,
        // required: [true, 'Job title is required'],
    },
    Company_name: {
        type: String,
        // required: [true, 'Company name is required'],
    },
    Start_date: {
        type: Date,
        // required: [true, 'Start date is required'],
    },
    End_date: {
        type: Date,
    },
    Is_current_employer: {
        type: Boolean,
        default: false
    }
});
 
const EducationSchema = new mongoose.Schema({
    Degree: {
        type: String,
        // required: [true, 'Degree is required'],
    },
    Field_of_study: {
        type: String,
        // required: [true, 'Field of study is required'],
    },
    start_date: {
        type: Date,
        // required: [true, 'Start date is required'],
    },
    end_date: {
        type: Date,
    }, 
    Is_current_education:{
        type: Boolean,
        default: false
    }
});
 
const CandidateSchema = new mongoose.Schema({
    First_name: {
        type: String,
        // required: [true, 'First name is required'],
        minLength: [3, "Name must be at least 3 characters"],
    },
    Last_name: {
        type: String,
    },
    Email: {
        type: String,
        // required: [true, 'Email is required'],
        // unique: true,
        // validate: [validator.isEmail, 'Please provide a valid email']
    },
    Mobile: {
        type: Number,
        // unique: true,
    },
    Current_location: {
        type: String,
        enum:['Pune','Mumbai', 'Kolkata', 'Delhi', '']
        // required: [true, 'Current location is required'],
    },
    Job_Title:{
        type: String,
    },
    Experience: [ExperienceSchema],
    Education: [EducationSchema],
    Total_Experiences: {
        type: String,
        enum: ['fresher','1-3 Years','3-5 Years','5-8 Years','8-12 Years','12+ Years'],
        default: 'fresher'
    },
    Current_salary: {
        type: Number,
        // required: [true, 'Current salary is required'],
    },
    Expected_salary: {
        type: Number,
    },
    Reason_for_change: {
        type: String,
    },
    Notice_period: {
        type:String,
        enum:['15 days', '1 Month', '2 Month', '3 Month',],
        default: '15days'
        // required: [true, 'Notice period is required'],
    },
    availabilityDate: {
        type: Date,
    },
    Linkedin: {
        type: String,
        // required: [true, 'LinkedIn profile is required'],
    },
    // Resume: {
    //     type: String,  // This can store the file path for the uploaded resume
    // },
    Remarks: {
        type: String,
    },
    locked: {
        type: Boolean,
        default: false
    },
    jd: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JD'
    }
}, { timestamps: true });
 
export const Candidate = mongoose.model('Candidate', CandidateSchema);
export const Experiences = mongoose.model('Experience', ExperienceSchema);
export const Educations = mongoose.model('Education', EducationSchema);