var FacebookStrategy = require('passport-facebook').Strategy
var Auth = require('./auth');

require('./mysql/models/user');

module.exports = function (passport) {

  passport.serializeUser(function(user, done) {
      done(null, user ? user.get('fbId') : false);
    });

  passport.deserializeUser(function (id ,done) {
    console.log('deserializeUser :', db.model('User').fetchById({ fbId: id }))
    db.model('User').fetchById({ fbId: id })
        .then(function(user) {
          done(null, user);
        })
        .catch(function(err){
          console.log(err)
          done(err, false);
        });
  })

  passport.use(new FacebookStrategy({
      clientID: Auth.clientId,
      clientSecret: Auth.clientSecret,
      passReqToCallback: true,
      enabledProof: false,
      profileFields: ['email', 'id', 'displayName', 'gender', 'photos', 'friends', 'about'],
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
          username : profile.displayName
        }).save()
      } else {
        console.log('IN CALLBACK: USER ALREADY EXISTS')
        return user
      }
    }).then(function(user) {
      return done(null, user)
    }).catch(function (err) {
      console.log(err);
      return done(err, false)
    })

    console.log(profile._json.friends);
  }))
}
