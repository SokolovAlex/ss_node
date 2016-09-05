var auth_cookie = 'x-auth';

module.exports = (next) => {
    return (req, res) => {
        var user = req.cookies[auth_cookie];
        if(!user) { return res.redirect('401'); }
        return next(req, res, user);
    };
};