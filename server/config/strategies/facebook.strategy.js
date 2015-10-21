var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(){
	passport.use('facebook', new FacebookStrategy({
		clientID: "192373821095177",
		clientSecret: "724c3b54713c51b5a349025675ef53fa",
		callbackURL: "http://localhost:8000/facebook/callback",
		passReqToCallBack: true
	},
	function(token, accessToken, refreshToken, profile, callback){
		User.findOne ( { "facebook.id" : profile.id }, function(err, user) {
			if(err){
				return callback(err);
			}

			if(user){
				return callback(null, user);
			}

			var newUser = new User();

			newUser.facebook.id = profile.id;
			newUser.facebook.token = token;
			newUser.facebook.email = profile.emails[0].value;

			newUser.save(function(err){
				if(err){
					throw err;
				}

				return callback(null, newUser);
			})
		})
	}));
}