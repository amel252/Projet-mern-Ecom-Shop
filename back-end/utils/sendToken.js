export default (user, statusCode, res) => {
    // create jwt token
    const token = user.getJwtToken();
    const options = {
        exprires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    // Set the cookie
    res.status(statusCode).cookie("token", token, options).json({
        token,
    });
};
