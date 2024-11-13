import ErrorResponse from "../utils/errorResponse.js";

const errorHandler = (err, _req, res, _next) => {
    let error = { ...err };
    error.message = err.message;

    // Handle CastError (e.g., invalid MongoDB ObjectId)
    if (err.name === "CastError") {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle duplicate key errors (e.g., unique field violation)
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Handle validation errors (e.g., Mongoose validation errors)
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400); // Changed to 400 for validation errors
    }

    // Send error response
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error"
    });
};

export default errorHandler;
