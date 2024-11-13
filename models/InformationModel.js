import mongoose from "mongoose";

const InformationSchema = new mongoose.Schema({
    
    //form page 1
    firstName: {
        type: String,
        // required: true,
    },
    lastName: { 
        type: String,
        // required: true,
    },
    mobileNumber: {
        type: String,
        // required: true,
    },
    location: {
        type: String,
        enum: ['newYork', 'losAngeles', 'chicago',''],
        // required: true,
    },
    dob: {
        type: Date,
        // required: true,
    },
    language: {
        type: String,
        // required: true,
    },

    //Form page 2
    highestQualification: {
        type: String,
        // required: true,
    },
    graduation: {
        type: String,
    },
    category: {
        type: String,
    },
    recruitmentExp: {
        type: Number,
    },
    preferredIndustry: {
        type: String,
    },
    aadharCard: { 
        type: String, 
    },
    gstCertificate: { 
        type: String, 
    },
    incorporationCertificate: { 
        type: String,
    },
    nameInBank: {
        type: String,
    },
    bankName: {
        type: String,
    },
    bankAccountNumber: {
        type: String,
    },
    bankIFSC: {
        type: String,
    },
    bankBranch: {
        type: String,
    },
    accountType: {
        type: String,
    },

    //page 4
    termsAndConditions: {
        type: Boolean,
    },
});

const Information = mongoose.model('Information', InformationSchema); // Corrected the model name

export default Information;