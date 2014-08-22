// set up 
var express		= require('express');
var app 		= express();
var port 		= process.env.port || 8080;
var mongoose 	= require('mongoose');
var passport	= require('passport');
var flash		= require('connect-flash');
var path 		= require('path');

var morgan	 		= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 	 	= require('body-parser');
var session	 		= require('express-session');

var configDB 	= require('./config/database.js');

// configuration
mongoose.connect(configDB.url); 

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

var year 	= 365 * 24 * 3600000; //3600000 is an hour * 24 hours a day * 365 days a year
app.use(session({ 
	secret: 'eladanddavidarethebestever',
	cookie: { maxAge: year }  
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./app/routes.js')(app, passport)

// launch
app.listen(port);
console.log('To infinity and beyond at port ' + port);
	