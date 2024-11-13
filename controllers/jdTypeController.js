// import jdType from "../models/jdTypeModels.js";
// import ErrorResponse from "../utils/errorResponse.js";


// //create jd category 
// export const createJDType = async(req, res, next) => {
//     try {
//         const jdT = await jdType.create({
//             jdTypeName: req.body.jdTypeName,
//             user: req.user.id
//         });
//         res.status(201).json({
//             success: true,
//             jdT
//         })
//     } catch (error) {
//         next(error);
//     }
// }

// //all jd category
// export const allJDsType = async(req, res, next) => {
//     try {
//         const jdT = await jdType.find();
//         res.status(200).json({
//             success: true,
//             jdT
//         })
//     } catch (error) {
//         next(error);
//     }
// }

// //update job types
// export const updateJDsType = async(req, res, next) => {
//     try {
//         const jdT = await jdType.findByIdAndUpdate( req.params.type_id, req.body, { new: true });
//         res.status(200).json({
//             success: true,
//             jdT
//         })
//     } catch (error) {
//         next(error);
//     }
// }

// //delete job types
// export const deleteJDsType = async(req, res, next) => {
//     try {
//         const jdT = await jdType.findByIdAndDelete( req.params.type_id );
//         res.status(200).json({
//             success: true,
//             message: "JD type Deleted"
//         })
//     } catch (error) {
//         next(new ErrorResponse("server Error", 500));
//     }
// }
