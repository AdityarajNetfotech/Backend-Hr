import { Candidate } from '../models/CandidateModels.js'
import ErrorResponse from '../utils/errorResponse.js';

// POST CANDIDATE
export const postcandidate = async (req, res, next) => {
    try {
        const CandidateForm = req.body;

        const {
            First_name,
            Last_name,
            Email,
            Contact_number,
            Current_location,
            Current_salary,
            Expected_salary,
            Reason_for_change,
            Notice_period,
            availabilityDate,
            // availabilityTime,
            Linkedin,
            Remarks,
            locked,
            Experiences = [], // Default to an empty array if undefined
            Educations = [],  // Default to an empty array if undefined
            userId
        } = CandidateForm;

        console.log(CandidateForm);

        // Ensure Experiences and Educations are arrays
        if (!Array.isArray(Experiences) || !Array.isArray(Educations)) {
            return res.status(400).json({ error: 'Experiences and Educations must be arrays' });
        }

        // Transform Experience data
        const experienceData = Experiences.map(exp => ({
            Job_title: exp.Job_title,
            Company_name: exp.Company_name,
            Start_date: exp.Start_date,
            End_date: exp.End_date,
            Is_current_employer: exp.Is_current_employer || false // Default to false if not provided
        }));

        // Transform Education data
        const educationData = Educations.map(edu => ({
            Degree: edu.Degree,
            Field_of_study: edu.Field_of_study,
            start_date: edu.start_date,
            end_date: edu.end_date,
            Is_current_education: edu.Is_current_education || false // Default to false if not provided
        }));

        // Create the candidate
        const candidate = await Candidate.create({
            First_name,
            Last_name,
            Email,
            Mobile: Contact_number,
            Current_location,
            Current_salary,
            Expected_salary,
            Reason_for_change,
            Notice_period,
            availabilityDate,
            Linkedin,
            Remarks,
            locked,
            Experiences: experienceData, // Use transformed experience data
            Educations: educationData,  // Use transformed education data
            userId
        });

        console.log("Candidate Information Created");

        res.status(201).json({
            success: true,
            candidate
        });

    } catch (error) {
        console.error(error);
        return next(new ErrorResponse("Error creating candidate", 500));
    }
};



// Load all candidates
export const showAllCandidate = async (req, res, next) => {
    try {
        // Fetch all candidates
        const userId = req?.user?._id || req?.body?.userId || req?.query?.userId;

        console.log("aaa", userId);

        const candidates = await Candidate.find({ userId })
            .populate('Experience') // Assuming Experience is a reference field
            .populate('Education'); // Assuming Education is a reference field

        if (!candidates || candidates.length === 0) {
            return next(new ErrorResponse("No candidates found created by this user", 404));
        }

        // Log the fetched candidates to the console for debugging
        console.log('Fetched candidates:', candidates);

        // Send the fetched candidates in the response
        res.status(200).json({
            success: true,
            data: candidates
        });
    } catch (error) {
        // Log the error and pass it to the error-handling middleware
        console.error('Error fetching candidates:', error);
        next(error);
    }
};


//show a single candidate 
export const singleCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        res.status(200).json({
            success: true,
            candidate
        })
    } catch (error) {
        next(error);
    }
};

//Edit candidate
export const editCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.status(200).json({
            success: true,
            candidate
        })
        next();
    }
    catch (error) {
        return next(error);
    }
};

//Delete Candidate
export const deleteCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted"
        })
        next();
    }
    catch (error) {
        return next(error);
    }
}