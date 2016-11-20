const assert = require('assert'),
      fs = require('fs'),
      rewire = require('rewire'),
      cwd = require('process').cwd();

// BDD interface in use (default)
// > mocha --check-leaks

var dbPath = cwd + '/test/db-test.db';
fs.unlink(dbPath, function(err) { // mocha before is buggy for me!
  if (!err)
    console.log('deleted old test db: ' + dbPath);
})

describe('db.js', function() {
  var db = require(cwd + '/src/db/db.js')(dbPath),
      username = 'joe',
      iv = 'abcdef213456',
      sharedSecret = 'def1531636163';

  describe('#addUser(username,iv,sharedSecret,callback)', function() {
    it('should create a user with the given properties', function(done) {
      db.addUser(username, iv, sharedSecret, function(err,result) {
        assert(err == null);
        done();
      });
    });

    it('should not allow duplicate users', function(done) {
      db.addUser(username, iv, sharedSecret, function(err,result) {
        assert(/UNIQUE constraint failed: USERS.USERNAME/.test(err));
        assert(result === undefined);
        done();
      });
    });
  });

  describe('#getUser(username,callback)', function() {

    it('should get a user with the given properties', function(done) {
      db.getUser(username, function(err,result) {
        if (err)
          throw err;

        assert(result.iv === iv);
        assert(result.sharedSecret === sharedSecret);
        done();
      });
    });
  });


  describe('#randomInt(min,max)', function(){
    const db = rewire(cwd + '/src/db/db.js');
    var randomInt = db.__get__('randomInt');

    it('should return a number for a valid min and max', function(){
      var result = randomInt(0,10);
      //console.log(result);
      assert(result >= 0);
      assert(result <= 10);
    });

    it('should throw for invalid inputs', function(){
      assert.throws(randomInt.bind(undefined,20,10),Error,"Expected an error here.");
    });
  });

});
