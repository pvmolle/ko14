exports.checkAuthentication = function (req, res, next) {
    if (req.session.token == null) {
        res.redirect("/authenticate");
    } else {
        next();
    }
}