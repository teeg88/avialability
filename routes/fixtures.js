var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Fixture = require('../models/fixtures.js');


router.get('/', isLoggedIn, function(req, res, next) {
  
  Fixture.find({}, (err, fixtures) => {
        if (err)
            return res.render('error', {error : err});

        fixtures = fixtures.sort((a, b)=>{
          return a.fixDate - b.fixDate;
        })

        res.render('fixtures', {title : 'Fixtures', fixtures, user: req.user});
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
    console.log(fixId);

    Fixture.findByIdAndRemove(fixId, (err) => {
        if (err) return console.log(err);
    });
    
    res.send('Fixture: ' + fixId + ' removed...');
});

router.get('/:user', isLoggedIn, function(req, res, next) {
  const userId = req.params.user;
  Fixture.find({}, (err, fixtures) => {
      if (err)
          return res.render('error', {error : err});

      fixtures = fixtures.sort((a, b)=>{
        return a.fixDate - b.fixDate;
      })

    res.render('userfix', {title: 'User Fixtures', userId, fixtures, user : req.user})
  });
});

router.put('/:user', isLoggedIn, function(req, res, next){
  // find fixture by fix ID
  // add user id avialble to fixture document
  // send response message "availability updated"? required? 
  res.redirect('/')
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    return next();
  } else {
    req.flash("loginMessage", "You need to be signed in to access that page")
    res.redirect('/signin');
  }
}

module.exports = router;
