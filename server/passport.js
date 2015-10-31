var FacebookStrategy = require('passport-facebook').Strategy
var Auth = require('./auth');

require('./mysql/models/user');

module.exports = function (passport) {

  passport.serializeUser(function(user, done) {
      done(null, user ? user.get('fbId') : false);
    });

  passport.deserializeUser(function (id ,done) {
    db.model('User').fetchById({ fbId: id })
        .then(function(user) {
          done(null, user);
        })
        .catch(function(err){
          console.log(err);
          done(err, false);
        });
  });

  passport.use(new FacebookStrategy({
      clientID: Auth.clientId,
      clientSecret: Auth.clientSecret,
      passReqToCallback: true,
      enabledProof: false,
      profileFields: ['id', 'birthday', 'email', 'displayName', 'gender', 'picture.type(large)', 'friends', 'about'],
      callbackURL: "http://localhost:8100/auth/facebook/callback"
    },
  function(req, accessToken, refreshToken, profile, done) {
    db.model('User').fetchById({
        fbId: profile.id,
        username: profile.displayName
    }).then(function (user) {
      if(!user) {
        return db.model('User').newUser({
          fbId : profile.id,
          username : profile.displayName,
          profile_pic: profile.photos[0].value,
          birthday: profile._json.birthday,
          email: profile._json.email,
          gender: profile._json.gender
        }).save()
      } else {
        console.log('IN CALLBACK: USER ALREADY EXISTS');
        return user;
      }
    }).then(function(user) {
      return done(null, user);
    }).catch(function (err) {
      console.log(err);
      return done(err, false);
    });

    console.log("PROFILE", profile);
  }));
};
