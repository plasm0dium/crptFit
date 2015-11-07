var passport = require('passport');
require('./passport')(passport);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require("express-session");


module.exports = function (app, express){
    // Create session every time a user log in
    app.use(session({
      key: 'crptFit',
      secret: 'Ted',
      enabledProof: false,
      resave: false,
      saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Render view from www folder
    app.use(express.static(__dirname + '/../../client/mobile/www'));

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Authenticate with Facebook
    app.use('/auth', require('../routes/facebook'));

    // Get user profile
    app.use('/auth', require('../routes/users'));

    // Get user's matches
    app.use('/auth', require('../routes/match'));

    // Get nearby users
    app.use('/auth', require('../routes/nearbyuser'));

    // Swipe check if swiped user has also swiped right on the user
    app.use('/auth', require('../routes/matchcheck'));

    // Pull newsfeed from completed tasks of friends
    app.use('/auth', require('../routes/newsfeed'));

    // Get current user information
    app.use('/auth', require('../routes/user'));

    // Logout User
    app.use('/logout', function(req, res){
      req.session.destroy();
      req.logout();
      res.redirect('/');
    });

    // Get user tasks
    app.use('/auth', require('../routes/task'));

    // Get user's friendlist
    app.use('/auth', require('../routes/friend'));

    // Get all users
    app.use('/auth', require('../routes/search'));

    // Get all the friend request
    app.use('/auth', require('../routes/friendrequest'));

    // Get User chat room ID
    app.use('/auth', require('../routes/chatsession'));

    // Get user progress
    app.use('/auth', require('../routes/progress'));

    // Post task from user
    app.use('/auth', require('../routes/posttask'));

    // Confirm friend request from user
    app.use('/auth', require('../routes/friendconfirm'));

    // Send a friend request to user
    app.use('/auth', require('../routes/friendreq'));

    // Create new Chat Session
    app.use('/auth', require('../routes/createchat'));

    // Add message to chat session
    app.use('/auth', require('../routes/addmessage'));

    // Add progress to database
    app.use('/auth', require('../routes/postprogress'));

    // Add user longtitude and latitude
    app.use('/auth', require('../routes/location'));

    // Post user swipes
    app.use('/auth', require('../routes/swipes'));

    // Update user profile
    app.use('/auth', require('../routes/updateprofile'));

};
