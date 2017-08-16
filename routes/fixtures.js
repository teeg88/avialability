const express 		= require('express');
const router 		= express.Router();
const bodyParser 	= require('body-parser');
const Fixture 		= require('../models/fixtures.js');
const User 			= require('../models/users.js');

 
router.get('/', isLoggedIn, (req, res, next)=>{
  
  	Fixture.find({}, (err, fixtures) => {
        if (err)
            return res.render('error', {error : err});

		fixtures = fixtures.sort((a, b)=>{
          return a.fixDate - b.fixDate;
		});

		res.render('fixtures', {
			title : 'Fixtures', 
			fixtures, 
			user: req.user});

	})
	
});

router.post('/', isLoggedIn, (req, res, next) => {
  
	const fixture = new Fixture({
		fixDate: req.body.fixDate,
		against: req.body.against,
		team: req.body.team,
		location: req.body.location
	});

	fixture.save((err) => {
		if (err) {
		res.render('error', {error: err});
		} else {
		res.redirect('/fixtures');
		}
	});

});

router.get('/delete/:fix_id', isLoggedIn, (req, res) => {
	const fixId = req.params.fix_id;

	Fixture.findByIdAndRemove(fixId, (err) => {
		if (err)
            return res.render('error', {error : err});
	});

	res.send('Fixture: ' + fixId + ' removed... <a href="/">continue</a>');
});

router.get('/:user', isLoggedIn, isUserPage, (req, res, next)=>{
  
    Fixture.find({}, (err, fixtures) => {
        if (err)
            return res.render('error', {error : err});

        fixtures = fixtures.sort((a, b)=>{
          return a.against - b.against;
		})

    res.render('userfix', {
		title: 'User Fixtures', 
		fixtures, 
		user : req.user});
    });
  
});

router.post('/:user', isLoggedIn, (req, res, next)=>{
	let fixtureId = req.body.fixtureId;
	let userId = req.params.user;
	let responseMessage = "";
	
	Fixture.findById(fixtureId, (err, fixture)=> {
		if (err)
			return res.render('error', {error : err});

		if (fixture.players.length > 0){

			let count = 0;

			for (var i = 0; i < fixture.players.length; i++){
				if (fixture.players[i].userId === userId){
					if (fixture.players[i].available == "Not Available"){
						fixture.players[i].available = "Not Set";
						responseMessage = "Not Set";						
					} else if (fixture.players[i].available == "Not Set"){
						fixture.players[i].available = "Available"
						responseMessage = "Available";
					} else if (fixture.players[i].available == "Available"){
						fixture.players[i].available = "Not Available";
						responseMessage = "Not Available";
					}
				} else count++;
			}

			if (count === fixture.players.length){
				fixture.players.push({ 
					userId : userId,
					available : "Available",
					firstName : req.user.details.firstName,
					lastName: req.user.details.lastName,
				});
				responseMessage = "Available";
			}

		} else {
			fixture.players.push({ 
				userId : userId,
				available : "Available",
				firstName : req.user.details.firstName,
				lastName: req.user.details.lastName,
			});
			responseMessage = "Available";
		}

		fixture.save((err, updatedFix)=>{
			if (err)
				return res.render('error', {error : err});
			res.send(responseMessage)
		})
	})

});

router.get('/fixture/:fix_id', isLoggedIn,  (req, res, next)=>{
	
	let fix_id = req.params.fix_id;
	
	Fixture.findOne({_id : fix_id}, (err, fixture) => {
		if (err)
			return res.render('error', {error : err});
		
		res.render('editFix', {
			fixture,
			user : req.user
		})
	});

});


router.get('/reset/all', isLoggedIn, (req, res, next)=> {
	
	Fixture.find({}, (err, fixtures)=>{
		
		for(let i = 0; i < fixtures.length; i++){
			
			Fixture.update(
				{ "_id": fixtures[i]._id }, 
				{
					"$pull": {
						"players": {}
					}
				}, 
				(err, numAffected) => {console.log("data:", numAffected)}
			); 

		}

		res.send('reset')
	});
});


function isUserPage(req, res, next) {
  	const userId = req.params.user;
	const sessionId = req.user._id;

	if (userId != sessionId){
		res.redirect('/');
	} else {
		return next();
	}
};


function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	} else {
		req.flash("loginMessage", "You need to be signed in to access that page")
		res.redirect('/signin');
	}
}




module.exports = router;
