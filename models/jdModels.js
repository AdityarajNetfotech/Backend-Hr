import mongoose from 'mongoose';
import User from './userModel.js';

mongoose.set('strictPopulate', false);
// const { ObjectId } = mongoose.Schema;

const jdSchema = new mongoose.Schema({
    job_title: {
        type: String,
    },
    company_Name: {
        type: String,
    },
    experience: {
        type: String,
        enum: ['fresher','1-3 Years','3-5 Years','5-8 Years','8-12 Years','12+ Years'],
        default: 'fresher'
    },
    industry: {
        type: String,
        enum: ['IT', 'Software','Testing'],
        default: 'IT'
    },
    location:{
        type:String
    },
    work_experience:{
        type:String
    },
    salary:{
        type:String
    },
    notice_period:{
        type:String,
        enum:['15days', '1', '2', '3',],
        default: '15days'
    },
    interview_rounds:{
        type:String,
        enum: ['1','2','3','4'],
        default: '1'
    },
    job_type:{
        type:String,
        enum: ['Full Time', 'Hybrid', 'On Site'],
        default: 'Full Time'
    },
    priority_tag:{
        type: String,
        enum: ['Hot', 'Normal'],
        default: 'Normal'
    },
    delivery_deadline:{
        type:Date
    },
    replacement_period:{
        type:String
    },
    no_of_vacancy:{
        type:String
    },
    absolute_payout:{
        type:String
    },
    delivery_payout:{
        type:String
    },
    sign_up_rate:{
        type:String
    },
    skills_required:{
        type: String,
    },
    additional_comments:{
        type:String
    },
    jd_status: {
        type: String,
        enum: [
            'Open', 
            'pending delivery(accepted but not yet delivered)', 
            'delivery done', 
            'interview stage', 
            'offer stage', 
            'Closed', 
            'Rework'
        ],
        default: 'Open'
    },
    locked: {
        type: Boolean,
        default:false
    },
    lockedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    candidates: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Candidate',
        required: true
    }]
}, { timestamps: true });

const JD = mongoose.model('JD', jdSchema);

export default JD;
