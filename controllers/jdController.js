// controllers/jdController.js
import JD from '../models/jdModels.js';
import { Candidate } from '../models/CandidateModels.js';
import ErrorResponse from '../utils/errorResponse.js';
 
//create JD
export const createJD = async (req, res, next) => {
    try {
        const {
            job_title, company_Name, experience, industry,location,work_experience,salary, notice_period,
            interview_rounds,job_type,priority_tag, delivery_deadline, replacement_period,
            no_of_vacancy, absolute_payout, delivery_payout,sign_up_rate, skills_required, additional_comments,
            jd_status, locked, lockedBy, user, candidates
        } = req.body;

        const userId = req.user._id;
 
        // Validate required fields based on jdSchema
        // if (!title || !client_name || !salary || !required_experience || !location ||
        //     !sign_up_rate || !payment_terms || !replacement_period || !no_of_openings ||
        //     !payout || !assured_time) {
        //     return next(new ErrorResponse('Please provide all required fields', 400));
        // }
 
        const jd = await JD.create({
            job_title, company_Name, experience, industry,location,work_experience,salary, notice_period,
            interview_rounds,job_type,priority_tag, delivery_deadline, replacement_period,
            no_of_vacancy, absolute_payout, delivery_payout,sign_up_rate, skills_required, additional_comments,
            jd_status, locked, lockedBy, user:userId, candidates
        });
 
        res.status(201).json({
            success: true,
            jd
        });
    } catch (error) {
        next(error);
    }
};
 
 
// single JD find
export const singleJD = async (req, res, next) => {
    try {
        const jd = await JD.findById(req.params.id);
 
        res.status(200).json({
            success: true,
            jd
        });
    } catch (error) {
        next(error);
    }
};
 
//Show all JDs
export const ShowJDs = async (req, res, next) => {
     try {
        // Fetch all job descriptions that are not expired
        const jds = await JD.find({ });
 
        // Log the fetched job descriptions to the console for debugging
        // console.log('Fetched job descriptions:', jds);
 
        // Send the fetched job descriptions in the response
        res.status(200).json({
            success: true,
            jds,
        });
    } catch (error) {
        // Log the error and pass it to the error-handling middleware
        console.error('Error fetching job descriptions:', error);
        next(error);
    }
 
};
 
//EDIT JD
export const editJD = async (req, res, next) =>{
    try{
        const jd = await JD.findByIdAndUpdate( req.params.id, req.body, { new: true });
 
        res.status(200).json({
            success: true,
            jd
        })
        next();
    }
    catch (error ){
        return next(error);
    }
}
 
//Delete User
export const deleteJD = async (req, res, next) =>{
    try{
        const jd = await JD.findByIdAndDelete( req.params.id );
 
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
 
// Lock a JD
export const lockJD = async (req, res, next) => {
    try {
      const { id } = req.params;
      const jd = await JD.findById(id);
  
      if (!jd) {
        return next(new ErrorResponse('JD not found', 404));
      }
  
      if (jd.locked) {
        return next(new ErrorResponse('JD is already locked by another user', 400));
      }
  
      jd.locked = true;
    //   jd.lockedBy = req.user.id;
      await jd.save();
  
      res.status(200).json({
        success: true,
        jd
      });
    } catch (error) {
      next(error);
    }
  };
  

// Show only locked JDs
export const ShowLockedJDs = async (req, res, next) => {
    try {
        // Fetch all job descriptions that are locked
        const lockedJDs = await JD.find({ locked: true });

        // Log the fetched locked job descriptions to the console for debugging
        console.log('Fetched locked job descriptions:', lockedJDs);

        // Send the fetched locked job descriptions in the response
        res.status(200).json({
            success: true,
            lockedJDs,
        });
    } catch (error) {
        // Log the error and pass it to the error-handling middleware
        console.error('Error fetching locked job descriptions:', error);
        next(error);
    }
};


 
//UNLOCK A JD
export const unlockJD = async (req, res, next) => {
    try {
        const { id } = req.params;
        const jd = await JD.findById(id);
 
        if (!jd) {
            return next(new ErrorResponse(`JD not found with id ${id}`, 404));
        }
 
        if (!jd.locked || jd.lockedBy.toString() !== req.user.id) {
            return next(new ErrorResponse('You do not have permission to unlock this JD', 403));
        }
 
        // Update jd_status to unlocked or any status indicating it's open
        jd.locked = false;
        jd.lockedBy = null;
        jd.jd_status = 'Open';
        await jd.save();
 
        res.status(200).json({
            success: true,
            jd
        });
    } catch (error) {
        next(error);
    }
};
 
 

// Add candidate to a locked JD
export const addCandidateToJD = async (req, res, next) => {
    try {
        const { jd_id, candidate_id } = req.body;

        const jd = await JD.findById(jd_id);
        if (!jd) {
            return next(new ErrorResponse('JD does not exist', 404));
        }

        if (!jd.locked) {
            return next(new ErrorResponse('JD is not locked', 400));
        }

        const candidate = await Candidate.findById(candidate_id);
        if (!candidate) {
            return next(new ErrorResponse('Candidate not found', 404));
        }

        candidate.jd = jd_id;  // Associate candidate with JD
        await candidate.save();

        jd.candidates.push(candidate_id);  // Add candidate ID to JD
        await jd.save();

        res.status(200).json({
            success: true,
            jd,
            candidate
        });
    } catch (error) {
        next(error);
    }
};

// Get all candidates from a locked JD
export const getCandidatesFromJD = async (req, res, next) => {
    try {
        const { jd_id } = req.params;  // Get JD ID from request parameters

        const jd = await JD.findById(jd_id).populate('candidates');  // Populate candidates
        if (!jd) {
            return next(new ErrorResponse('JD does not exist', 404));
        }

        if (!jd.locked) {
            return next(new ErrorResponse('JD is not locked', 400));
        }

        // Candidates are now populated and can be accessed directly
        res.status(200).json({
            success: true,
            candidates: jd.candidates  // Return the list of candidates
        });
    } catch (error) {
        next(error);
    }
};


// Get JDs created by the logged-in user
export const getJDsByUser = async (req, res, next) => {
    try {
        // Assuming `req.user._id` contains the logged-in user's ID
        const userId = req.user._id;
        console.log(userId);
        

        // Find JDs created by the logged-in user
        const jds = await JD.find({ user: userId });

        // Check if the user has created any JDs
        if (!jds || jds.length === 0) {
            return next(new ErrorResponse("No JDs found for this user", 404));
        }

        // Respond with the found JDs
        res.status(200).json({
            success: true,
            count: jds.length,
            jds
        });
    } catch (error) {
        next(error);
    }
};











// // controllers/jdController.js
// import JD from '../models/jdModels.js';
// import { Candidate } from '../models/CandidateModels.js';
// import ErrorResponse from '../utils/errorResponse.js';

// //create JD
// export const createJD = async (req, res, next) => {
//     try {
//         const {
//             title, industry, client_name, salary, required_experience, location,
//             rounds_of_interview, notice_period, sign_up_rate, payment_terms,
//             replacement_period, no_of_openings, payout, assured_time, remarks, spoc, jd_status
//         } = req.body;

//         // Validate required fields based on jdSchema
//         if (!title || !client_name || !salary || !required_experience || !location ||
//             !sign_up_rate || !payment_terms || !replacement_period || !no_of_openings ||
//             !payout || !assured_time) {
//             return next(new ErrorResponse('Please provide all required fields', 400));
//         }

//         const jd = await JD.create({
//             title, industry, client_name, salary, required_experience, location,
//             rounds_of_interview, notice_period, sign_up_rate, payment_terms,
//             replacement_period, no_of_openings, payout, assured_time, remarks, spoc, jd_status
//         });

//         res.status(201).json({
//             success: true,
//             jd
//         });
//     } catch (error) {
//         next(error);
//     }
// };


// // single JD find
// export const singleJD = async (req, res, next) => {
//     try {
//         const jd = await JD.findById(req.params.id);

//         res.status(200).json({
//             success: true,
//             jd
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Controller to show all JDs
// export const getAllJDs = async (req, res, next) => {
//     try {
//         // Enable search
//         const keyword = req.query.keyword ? {
//             title: {
//                 $regex: req.query.keyword,
//                 $options: 'i'
//             }
//         } : {};

//         // Filter jobs by location
//         const location = req.query.location || '';
//         const locationFilter = location !== '' ? location : null; // Use null if no specific location filter

//         // Enable pagination
//         const pageSize = 3;
//         const page = Number(req.query.pageNumber) || 1;

//         // Build the query object
//         const query = {
//             ...keyword,
//             ...(locationFilter && { location: locationFilter }) // Only add location filter if specified
//         };

//         // Count total documents matching the query
//         const count = await JD.countDocuments(query);

//         // Fetch JDs based on the query, sorting, and pagination
//         const jds = await JD.find(query)
//             .sort({ createdAt: -1 })
//             .populate('user', 'firstName')
//             .skip(pageSize * (page - 1))
//             .limit(pageSize);

//         // Check if any JDs were found
//         if (!jds || jds.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'No job descriptions found'
//             });
//         }

//         res.status(200).json({
//             success: true,
//             jds,
//             page,
//             pages: Math.ceil(count / pageSize),
//             count
//         });
//     } catch (error) {
//         next(error);
//     }
// };



// //EDIT JD
// export const editJD = async (req, res, next) =>{
//     try{
//         const jd = await JD.findByIdAndUpdate( req.params.id, req.body, { new: true });

//         res.status(200).json({
//             success: true,
//             jd
//         })
//         next();
//     }
//     catch (error ){
//         return next(error);
//     }
// }

// //Delete User
// export const deleteJD = async (req, res, next) =>{
//     try{
//         const jd = await JD.findByIdAndDelete( req.params.id );

//         res.status(200).json({
//             success: true,
//             message: "User deleted"
//         })
//         next();
//     }
//     catch (error ){
//         return next(error);
//     }
// }

// // Lock a JD
// export const lockJD = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const jd = await JD.findById(id);

//         if (!jd) {
//             return next(new ErrorResponse('JD not found', 404));
//         }

//         if (jd.locked) {
//             return next(new ErrorResponse('JD is already locked by another user', 400));
//         }

//         jd.locked = true;
//         jd.lockedBy = req.user.id;
//         await jd.save();

//         res.status(200).json({
//             success: true,
//             jd
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// //UNLOCK A JD
// export const unlockJD = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const jd = await JD.findById(id);

//         if (!jd) {
//             return next(new ErrorResponse(`JD not found with id ${id}`, 404));
//         }

//         if (!jd.locked || jd.lockedBy.toString() !== req.user.id) {
//             return next(new ErrorResponse('You do not have permission to unlock this JD', 403));
//         }

//         jd.locked = false; 
//         jd.lockedBy = null;
//         jd.jd_status = 'Open';
//         await jd.save();

//         res.status(200).json({
//             success: true,
//             jd
//         });
//     } catch (error) {
//         next(error);
//     }
// };


// // Add candidate to a locked JD
// export const addCandidateToJD = async (req, res, next) => {
//     try {
//         const { jdId, candidateId } = req.body;

//         // Check if JD exists
//         const jd = await JD.findById(jdId);
//         if (!jd) {
//             return next(new ErrorResponse('JD does not exist', 404));
//         }

//         // Check if JD is locked and if the user has permission
//         if (!jd.locked) {
//             return next(new ErrorResponse('JD is not locked', 400));
//         }

//         if (jd.lockedBy.toString() !== req.user.id) {
//             return next(new ErrorResponse('You do not have permission to add candidates to this JD', 403));
//         }

//         // Check if Candidate exists
//         const candidate = await Candidate.findById(candidateId);
//         if (!candidate) {
//             return next(new ErrorResponse('Candidate not found', 404));
//         }

//         // Update Candidate and JD
//         candidate.locked = true;
//         candidate.jd = jdId; // Set JD ID
//         await candidate.save(); // Save once

//         jd.candidates.push(candidateId);
//         await jd.save(); // Save JD

//         res.status(200).json({
//             success: true,
//             jd,
//             candidate
//         });
//     } catch (error) {
//         next(error);
//     }
// };



// // Remove candidate from a locked JD and unlock the candidate
// export const removeCandidateFromJD = async (req, res, next) => {
//     try {
//         const { jdId, candidateId } = req.body;

//         const jd = await JD.findById(jdId);
//         if (!jd) {
//             return next(new ErrorResponse('JD does not exist', 404));
//         }

//         if (!jd.locked) {
//             return next(new ErrorResponse('JD is not locked', 400));
//         }

//         const candidate = await Candidate.findById(candidateId);
//         if (!candidate) {
//             return next(new ErrorResponse('Candidate not found', 404));
//         }

//         if (!jd.candidates.includes(candidateId)) {
//             return next(new ErrorResponse('Candidate is not assigned to this JD', 400));
//         }

//         jd.candidates.pull(candidateId);
//         await jd.save();

//         candidate.locked = false;
//         await candidate.save();

//         res.status(200).json({
//             success: true,
//             message: 'Candidate removed from JD and unlocked successfully',
//             jd,
//             candidate
//         });
//     } catch (error) {
//         next(error);
//     }
// };


 
// Add candidate to a locked JD
// export const addCandidateToJD = async (req, res, next) => {
//     try {
//         const { jd_id, candidate_id } = req.body;
 
//         const jd = await JD.findById(jd_id);
//         if (!jd) {
//             return next(new ErrorResponse('JD does not exist', 404));
//         }
 
//         if (!jd.locked) {
//             return next(new ErrorResponse('JD is not locked', 400));
//         }
 
//         if (!jd.locked || jd.lockedBy.toString() !== req.user.id) {
//             return next(new ErrorResponse('You do not have permission to add candidates to this JD', 403));
//         }
 
//         const candidate = await Candidate.findById(candidate_id);
//         if (!candidate) {
//             return next(new ErrorResponse('Candidate not found', 404));
//         }
 
//         candidate.jd = jdId;
//         await candidate.save();
 
//         jd.candidates.push(candidateId);
//         await jd.save();
 
//         res.status(200).json({
//             success: true,
//             jd,
//             candidate
//         });
//     } catch (error) {
//         next(error);
//     }
// };