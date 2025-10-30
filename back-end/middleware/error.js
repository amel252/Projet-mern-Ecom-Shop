import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    // les erreurs contenant le statusCode server
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server",
    };
    // erreur venant de mongoose
    if (error.name === "CastError") {
        const message = `Ressource not found.invalid:${err?.path}`;
        error = new ErrorHandler(message, 404);
    }
    if (error.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }
    if (err.code === 1000) {
        const message = `Duplicate${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    }
    // Validation JWT:
    if (error.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid, try Again !!`;
        error = new ErrorHandler(message, 400);
    }
    if (error.name === "TokenExpiredError") {
        const message = `JSON Web Token is expire , try Again !!`;
        error = new ErrorHandler(message, 400);
    }
    // Erreur de dev ou prod
    if (process.env.NODE_ENV === "DEVELOPMENT") {
        // si je suis en devlopement
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
