var hikes = require('../app/dbservices/hikes'); 
var ranks = require('../app/dbservices/ranks'); 
var users = require('../app/dbservices/users'); 

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

	//Get the hike page by ID
	app.get('/hikes/:id', hikes.findById); 

	//Get the add-rank page for a hike, by ID
	app.get('/hikes/:id/addRank', isLoggedIn, ranks.addRank);

	//Save the rank for a hike, by ID and user (using session)
	app.post('/hikes/:id/addRank', isLoggedIn, ranks.saveRank);

	//Get the ranks for a hike, by ID and ranking page number
	app.get('/hikes/:id/rankingPage/:number', ranks.getRankingPage)

	//Get all hikes in DB
	app.get('/hikes', hikes.findAll);

	//Find hikes near location (lon, lat) in radius of 10km
	app.get('/hikes/findNearMe/:lon/:lat', isLoggedIn, hikes.getHikesNear);

	//Get hikes search page
	app.get('/search/hikes', function(req, res) {
		res.render('search', { message : '' });
	}); 

	//Get hikes by difficulty and area (given by user in search)
	app.post('/search/hikes', hikes.search);

	//Get the start hike page where you log the time and distance of the hike
	app.get('/hikes/:id/startHike', isLoggedIn, function(req, res) {
		res.render('startHike', {});
	});

	//Post the user's hike details to the DB
	app.post('/hikes/:id/logHike', isLoggedIn, users.logHike);

	//Defalut routing for unknown page
	app.get('/*', isLoggedIn, function(req, res) {
		res.redirect('/profile');			
	});
};

//heck if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
}

