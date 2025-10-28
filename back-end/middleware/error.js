import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    // les erreurs contenant le statusCode server
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server",
    };
    // si je suis en devlopement
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
        });
    }
    // si je suis en prod
    if (process.env.NODE_ENV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message,
        });
    }

    res.status(error.statusCode).json({
        message: error.message,
    });
};
