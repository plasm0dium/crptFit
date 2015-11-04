var request = require('request');
var expect = require('../../node_modules/chai/chai').expect;
var server = require('../server');
var stubs = require('./Stubs');
var db = require('../mysql/config');
var User = require('../mysql/collections/users');
supertest = require('supertest');
api = supertest('http://localhost:8100')
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
        })
      });
    });
});

describe('GET route auth/user:id', function() {
  it('should return an object with keys and values', function (done) {
    api.get('/auth/user1')
    .set('Accept', 'application/json')
    .end(function(err, res) {
    .expect(res.data).to.have.property('username');
    .expect(res.data.username).to.not.equal(null);
    .expect(res.data).to.have.property('profile_pic');
    .expect(res.data.profile_pic).to.not.equal(null);
    .expect(res.data).to.have.property('relations');
    .expect(res.data.relations).to.not.equal(null)
    done()
    })
  })
}
