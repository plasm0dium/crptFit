var request = require('request');
var expect = require('../../node_modules/chai/chai').expect;
var server = require('../server');
var stubs = require('./Stubs');
var db = require('../mysql/config');
var User = require('../mysql/collections/users');
var io = require('socket.io');
var mysql = require('mysql');


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

describe('messages', function(){
    var db;
  beforeEach(function(done) {
    db = mysql.createConnection({
      user: "root",
      password: "",
      database: "crptfit"
    });
    db.connect();
    var tablename = "messages";
    db.query("truncate " + tablename, done);
  });

    afterEach(function() {
      db.end();
    });




    it('should insert a sent message into the database', function(done){
      request({
        method: 'POST',
        uri: 'http://127.0.0.1:8100/auth/messages/add',
        json: {
          user_id: 1,
          chat_id: 10,
          text: 'this really should go in the db'
        }
      })
      var qs = 'SELECT * FROM messages';
      var qa = [];
      db.query(qs, qa, function(err, results){
        console.log('this is results ', results)
        // expect(results[0].text).to.equal('this really should go in the db')
      })
      done();
    });
});

describe('benchpress', function(){
  var db;
  beforeEach(function(done){
    db = mysql.createConnection({
      user: "root",
      password: "",
      database: "crptfit"
    });
    db.connect();
    var tablename = 'benchpress';
    db.query('truncate ' + tablename, done)
  });
  afterEach(function(){
    db.end
  });
  it('should insert a number into the benchpress table', function(done){
    var qs = "INSERT INTO benchpress (id, benchpress, user_id) VALUES (?, ?, ?)";
    var qa = [1, 100, 1];
    db.query(qs, qa, function(err){
      if(err){throw err;}
      request('http://127.0.0.1:8100/auth/benchpress/1', function(err, res, body){
        console.log(JSON.parse(body)[0])
        expect(JSON.parse(body)[0].benchpress).to.equal(100);
      })
    })
  })
  // it('should not allow a user to post words', function(done){
  //   var qs = "INSERT INTO benchpress (id, benchpress, user_id) Values (?, ?, ?)";
  //   var qa = [1, 'benchpress is fun', 1];
  //   db.query(qs, qa, function(err){
  //     if(err){throw err;}
  //     request('http://127.0.0.1:8100/auth/benchpress/' + qa[2], function(err, res, body){
  //       expect(JSON.parse(body).to.not.equal('benchpress is fun'));
  //     })
  //   })
  // })
})
// describe("DOM Tests", function () {
//     var myEl = document.querySelector('div');
//     it("is NOT in the DOM", function () {
//         expect(myEl).to.equal(null);
//     });
//     var ionEl = document.querySelector('ion-nav-view');
//     it('is on the dom', function(){
//       expect(ionEl).to.not.equal(null);
//     })
// });