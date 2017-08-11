// configure passport js 
const LocalStrategy     = require('passport-local').Strategy;
const User              = require('../models/users');

// expose passport function to app
module.exports = function(passport) {

    // session serialize and deserialise

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

// local sign up strategy

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
            	return done(err);

            if (password != req.body.password2){
                return done(null, false, req.flash('signupMessage', 'Passwords do not match.'));
            }

            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
            } else {

				// if there is no user with that email, create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email         = email;
                newUser.local.password      = newUser.generateHash(password); // use the generateHash function in our user model
                newUser.details.firstName   = req.body.firstName;
                newUser.details.lastName    = req.body.lastName;

				// save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    }));

    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'Username or password incorrect')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Username or password incorrect')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

};


