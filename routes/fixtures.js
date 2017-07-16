var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Fixture = require('../models/fixtures.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  Fixture.find({}, (err, fixtures) => {
        if (err)
            return res.render('error', {error : err});

        fixtures = fixtures.sort((a, b)=>{
          return a.fixDate - b.fixDate;
        })

        res.render('fixtures', {title : 'Fixtures', fixtures});
    });  
});

router.post('/', (req, res, next) => {
  
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

router.delete('/', (req, res) => {
    const fixId = req.body.id;
    console.log(fixId);

    Fixture.findByIdAndRemove(fixId, (err) => {
        if (err) return console.log(err);
    });
    
    res.send('Fixture: ' + fixId + ' removed...');
});

router.get('/:user', function(req, res, next) {
  const userId = req.params.user;
  Fixture.find({}, (err, fixtures) => {
      if (err)
          return res.render('error', {error : err});

      fixtures = fixtures.sort((a, b)=>{
        return a.fixDate - b.fixDate;
      })

    res.render('userfix', {title: 'User Fixtures', userId, fixtures})
  });  
  
});

module.exports = router;
