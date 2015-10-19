var passport = require('passport');

module.exports = function(app){
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	// place a user into session
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	// pull a user out of session
	passport.deserializeUser(function(user, done){
		User.findById(id, function(err, user){
			callback(err, user);
		});
	});
	
	require('./strategies/facebook.strategy')();

};
