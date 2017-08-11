const express 		= require('express');
const router 		= express.Router();
const bodyParser 	= require('body-parser');
const Fixture 		= require('../models/fixtures.js');
const User 			= require('../models/users.js');

 
router.get('/', isLoggedIn, (req, res, next)=>{
  
  	Fixture.find({}, (err, fixtures) => {
        if (err)
            return res.render('error', {error : err});

		return fixtures;
	
  	}).then((fixtures) => {

		fixtures = fixtures.sort((a, b)=>{
          return a.fixDate - b.fixDate;
		});

		res.render('fixtures', {
			title : 'Fixtures', 
			fixtures, 
			user: req.user});
	});
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

router.delete('/', isLoggedIn, (req, res) => {
	const fixId = req.body.id;

	Fixture.findByIdAndRemove(fixId, (err) => {
		if (err)
            return res.render('error', {error : err});
	});

	res.send('Fixture: ' + fixId + ' removed...');
});

router.get('/:user', isLoggedIn, isUserPage, (req, res, next)=>{
  
    Fixture.find({}, (err, fixtures) => {
        if (err)
            return res.render('error', {error : err});

        fixtures = fixtures.sort((a, b)=>{
          return a.fixDate - b.fixDate;
		})

    res.render('userfix', {
		title: 'User Fixtures', 
		fixtures, 
		user : req.user});
    });
  
});

router.post('/:user', (req, res, next)=>{
	const fixtureId = req.body.fixtureId;
	const userId = req.params.user;
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

router.get('/reset/reset/:id', isLoggedIn, (req, res, next)=> {
		
	Fixture.update(
		{ "_id": req.params.id }, 
		{
			"$pull": {
				"players": {}
			}
		}, 
		(err, numAffected) => {console.log("data:", numAffected)}
	); 

	res.send('reset')
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
