const express       = require('express');
const router        = express.Router();
const bodyParser    = require('body-parser');
const Fixture       = require('../models/fixtures.js');
const User          = require('../models/users.js');
const passport      = require('passport');

router.get('/', isLoggedIn, (req, res, next)=>{
	res.render('index', {
		title : "User Home",
		user : req.user // get the user out of session and pass to template
	});
});

router.get('/users', isLoggedIn, (req, res, next)=> {

	User.find({}, (err, users)=>{
		if (err)
			return res.render('error', {error : err});
		res.render('users', {
			title : "Users",
			users,
			user : req.user,
		})
	});

})


router.get('/signup', (req, res, next) => {
	if (req.user){
		res.redirect('/')
	} else { 
		res.render('signup', { 
			title: 'Sign Up', 
			flashMessage : req.flash('signupMessage') 
		})
	}   
});

router.post('/signup',
	passport.authenticate('local-signup', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

router.get('/signin', (req, res, next)=>{
  	res.render('signin', { title : 'Log In', flashMessage : req.flash('loginMessage') })
});

router.post('/signin',
	passport.authenticate('local-login', {
		successRedirect : '/', // redirect to the secure profile section
		failureRedirect : '/signin', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
}));

router.get('/setup', (req, res, next) => {
	res.send('Under construction...')
	// settings for the app to go here - club name etc. 
})

router.get('/logout', (req, res, next)=>{
	req.logout();
	res.redirect('/signin');
});


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	} else {
		req.flash("loginMessage", "You need to be signed in to access that page")
		res.redirect('/signin');
	};
};

module.exports = router;
