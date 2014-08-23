var hikes = require('../app/dbservices/hikes');
module.exports = function(app, passport) {
	
	app.get('/', isLoggedIn, function(req, res) {
		res.redirect('/profile');			
	});

	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage')});
	});

	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', 
		failureRedirect : '/signup',
		failureFlash 	: true
	}));

	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash 	: true
	}));

	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/hikes/:id', hikes.findById);

	app.get('/hikes', hikes.findAll);

	app.get('/trails/:area', function(req, res) {

	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.render('index.ejs');
}

