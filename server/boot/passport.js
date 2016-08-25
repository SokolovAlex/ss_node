const passport = require('passport');

module.exports = (app) => {

    app.use(express.session({ secret: 'SECRET' }));

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });


    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err,user){
            err
                ? done(err)
                : done(null,user);
        });
    });

    return ;
};

