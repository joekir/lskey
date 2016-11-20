const assert = require('assert'),
      fs = require('fs'),
      cwd = require('process').cwd();

// BDD interface in use (default)
// > mocha --check-leaks

var dbPath = cwd + '/test/test.db';
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
});
