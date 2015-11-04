var request = require('request');
var expect = require('../../node_modules/chai/chai').expect;
var server = require('../server');
var stubs = require('./Stubs');
var db = require('../mysql/config');
var User = require('../mysql/models/users');
var User = require('../mysql/collections/users');
supertest = require('supertest');
api = supertest('http://localhost:8100');
require('../mysql/collections/geolocations');
require('../mysql/models/geolocation');


describe('server', function() {
  it('should response to GET requests for /auth/facebook with a 200 status code', function(done){
    request('http://localhost:8100/auth/facebook/callback', function(error, response, body){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should response to GET requests for /tab/homepage with a 200 status code', function(done){
    request('http://localhost:8100/tab/homepage', function(error, response, body){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should response to GET requests for /auth/tasks with a 200 status code', function(done){
    request('http://localhost:8100/auth/tasks', function(error, response, body){
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should 404 when asked for a nonexistent file', function(done) {
      request('http://localhost:8100/nonexistent', function(error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
      });
    });

  it('Should send back an Array of friends Object', function(done){
    request('http://localhost:8100/auth/friends', function(error, response, body){
      expect();
    });
  });
});

describe('Routing', function () {
  var $scope, $state;
  beforeEach(module('crptFit'));

  beforeEach(inject(function($injector){
    $state = $injector.get('$state');
    $scope = $injector.get('$rootScope').$new();
  }));

  it('Should have /login state, template, and no controller', function() {
    expect($state.state['/login']).to.be.ok();
    expect($state.state['/login'].controller).to.be(false);
    expect($state.state['/login'].templateUrl).to.be('templates/login-tab.html');
  });

  it('Should have /profile state, template, and controller', function(){
    expect($state.state['/profile']).to.be.ok();
    expect($state.state['/profile'].controller).to.be('ProfileCtrl');
    expect($state.state['/profile'].templateUrl).to.be('templates/profile-tab.html');
  });

  it('Should have /viewuser state, template, and controller', function(){
    expect($state.state['/viewuser']).to.be.ok();
    expect($state.state['/viewuser'].controller).to.be(false);
    expect($state.state['/viewuser'].templateUrl).to.be('templates/profile-view.html');
  });
});

describe('User', function(){
  var db = new User,
  chris = new User('chris'),
  ricky = new User('ricky'),
  paul = new User('paul');

  beforeEach(function(done){
    db.clear(function(err){
      if (err) return done(err);
      db.save([chris, ricky, paul], done);
    });
  });

  describe('fetchById()', function(){
    it('response profile accordingly to user_id', function(done){
      db.fetchById({type: 'User'}, function(err, res){
        if(err) return done(err);
        res.should.have.length(1);
        done();
      });
    });
  });
});

describe('chats', function(){
    var db;
  beforeEach(function(done) {
    db = mysql.createConnection({
      user: "root",
      password: "",
      database: "chats"
    });
    db.connect();
    var tablename = "messages";
    db.query("truncate " + tablename, done);
  });

    afterEach(function() {
      db.end();
    });
    it('should create a new chat table with two user relations in the database', function(done){
      var qs = "INSERT INTO Chats (id, user_id, user2_id) VALUES (?, ?, ?)";
      var qa = [10, 1, 2];
      db.query(qs, qa, function(err){
        if(err){throw err;}
        request("http://127.0.0.1:8100/auth/chats/get" + qa[0], function(err, res, body){
          expect(JSON.parse(body)).to.equal(10);
        });
      });
    });
});

describe('GET route auth/user:id', function() {
  it('should return an object with keys and values', function (done) {
    api.get('/auth/user1')
    .set('Accept', 'application/json')
    .end(function(err, res) {
    .expect(res.data).to.have.property('username')
    .expect(res.data.username).to.not.equal(null)
    .expect(res.data).to.have.property('profile_pic')
    .expect(res.data.profile_pic).to.not.equal(null)
    .expect(res.data).to.have.property('relations')
    .expect(res.data.relations).to.not.equal(null)
    done();
    });
  });
});
