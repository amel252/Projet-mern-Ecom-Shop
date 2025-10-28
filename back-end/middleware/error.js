import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    // les erreurs contenant le statusCode
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server",
    };
    res.status(error.statusCode).json({
        message: error.message,
    });
};
