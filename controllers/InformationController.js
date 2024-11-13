import ErrorResponse from "../utils/errorResponse.js";
import Information from '../models/InformationModel.js';


export const CreateInfo = async (req, res, next) => {
    try {
        const InformationForm = req.body;


        const {
            firstName, lastName, mobileNumber, location, dob, language, highestQualification, graduation, category, recruitmentExp, preferredIndustry,
            aadharCard, gstCertificate, incorporationCertificate, nameInBank, bankName,
            bankAccountNumber, bankIFSC, bankBranch, accountType, termsAndConditions
        } = InformationForm;

        console.log(InformationForm);

        const information = await Information.create({
            firstName, lastName, mobileNumber, location, dob, language, highestQualification, graduation, category, recruitmentExp, preferredIndustry,
            aadharCard, gstCertificate, incorporationCertificate, nameInBank, bankName,
            bankAccountNumber, bankIFSC, bankBranch, accountType, termsAndConditions
        });

        // Send a success response
        return res.status(201).json({
            success: true,
            information
        });


    } catch (error) {
        // Handle the error properly
        console.error(error);
        return next(new ErrorResponse('Error creating information', 500)); // Send a proper error response
    }
}
