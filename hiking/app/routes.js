var hikes = require('../app/dbservices/hikes'); 
var ranks = require('../app/dbservices/ranks'); 
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

	app.get('/hikes/:id/addRank', isLoggedIn, ranks.addRank);

	app.post('/hikes/:id/addRank', isLoggedIn, ranks.saveRank);

	app.get('/hikes/:id/rankingPage/:number', ranks.getRankingPage)

	app.get('/hikes', hikes.findAll);

	app.get('/hikes/findNearMe/:lon/:lat', isLoggedIn, hikes.getHikesNear);

	app.get('/search/hikes', function(req, res) {
		res.render('search', { message : '' });
	}); 

	app.post('/search/hikes', hikes.search);

	app.get('/*', isLoggedIn, function(req, res) {
		res.redirect('/profile');			
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/login');
	//res.send( { redirect : '/login' });
}

