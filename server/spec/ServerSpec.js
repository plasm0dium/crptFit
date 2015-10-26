var request = require('request');
var expect = require('../../node_modules/chai/chai').expect;
var server = require('../server');
var stubs = require('./Stubs');
var db = require('../mysql/config');
var User = require('../mysql/collections/users');

// Conditional async testing, akin to Jasmine's waitsFor()
// Will wait for test to be truthy before executing callback
function waitForThen(test, cb) {
  setTimeout(function() {
    test() ? cb.apply(this) : waitForThen(test, cb);
  }, 5);
}


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


