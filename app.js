const express       	= require('express');
const path          	= require('path');
const favicon       	= require('serve-favicon');
const logger        	= require('morgan');
const cookieParser  	= require('cookie-parser');
const bodyParser  	= require('body-parser');
const mongoose    	= require('mongoose');

const session			= require('express-session');
const passport   		= require('passport');
const flash 			= require('connect-flash');

const index			= require('./routes/index');
const fixtures		= require('./routes/fixtures');
const users 			= require('./routes/user');

const app = express();

// mongoose db connection
mongoose.connect('mongodb://app:u56YVJr5ePxXhhGE@ds023118.mlab.com:23118/tgooding');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('connected to ' + db.name + ' db')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

require('./passport/passport')(passport);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: '4S3crettotellsomebody' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use('/', index);
app.use('/fixtures', fixtures);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
