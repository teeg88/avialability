const express 		= require('express');
const router 		= express.Router();
const bodyParser 	= require('body-parser');
const Fixture 		= require('../models/fixtures.js');
const User 			= require('../models/users.js');


router.get('/', isLoggedIn, (req, res, next)=> {
    
    User.find({}, (err, users)=>{
        if (err)
            return res.render('error', {error : err});
        res.render('users', {
            title : "Users",
            users,
            user : req.user,
        })
    });
    
});

router.get('/:user_id', isLoggedIn, (req, res, next) => {

    let user_id = req.params.user_id;
    
    User.findOne({_id : user_id}, (err, user)=>{
        if (err)
            return res.render('error', {error : err});
        
        res.render('editUser', {
            user
        })
    
    })
});

router.post('/:user_id', isLoggedIn, (req, res, next) => {

    let user_id = req.params.user_id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let admin = req.body.admin;
    
    User.findById(user_id, (err, user)=>{
        if (err)
            return res.render('error', {error : err});

        user.details.firstName = firstName;
        user.details.lastName = lastName;
        user.local.firstName = email;
        user.details.admin = admin;

        user.save((err, updatedUser)=>{
            if (err)
                return res.render('error', {error : err});
            res.redirect('/users');
        });
    });
});

router.delete('/:user_id', isLoggedIn, (req, res, next)=>{

    let user_id = req.params.user_id;

    User.deleteOne({_id : user_id}, (err, deletedUser)=>{
        if (err)
            return res.render('error', {error : err});

        Fixture.find({}, (err, fixtures)=>{
            if (err)
                return res.render('error', {error : err});

            for (let i = 0; i < fixtures.length; i++){
                Fixture.update(
                    { "_id": fixtures[i]._id }, 
                    {
                        "$pull": {
                            "players": { userId : user_id }
                        }
                    }, 
                    (err, numAffected) => {console.log("data:", numAffected)}
                ); 
            }

        });
        
        res.send(deletedUser);
    
    });

   

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
