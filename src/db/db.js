const sqlite3 = require('sqlite3'),
      fs = require('fs');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// ctor
function db(dbPath){
  if(!(this instanceof db)){
    return new db(dbPath);
  };

  this.dbPath = dbPath
  console.log("opening DB handle at: " + this.dbPath);
  fs.access(this.dbPath, fs.constants.F_OK, (err) => {
    this.sqldb = new sqlite3.Database(this.dbPath);
    if (err) {
      console.log("creating new DB at: " + this.dbPath);
      // In this case we need to also initialize it
      this.sqldb.run("CREATE TABLE USERS(ID INT PRIMARY KEY NOT NULL,USERNAME TEXT NOT NULL,"
                  +"IV TEXT NOT NULL, SECRET TEXT NOT NULL);");
    }
  });
}

db.prototype.close = function close(){
  if (this.sqldb !== undefined && this.sqldb.open)
    this.sqldb.close();
}

db.prototype.addUser = function addUser(username, iv, sharedSecret, next) {
    if(!this.sqldb.open)
      next(Error("db not open"),null)

    this.sqldb.run("INSERT INTO USERS(ID,USERNAME,IV,SECRET) VALUES(?,?,?,?)", randomInt(1, 65535), username, iv, sharedSecret, next);
}

db.prototype.getUser = function getUser(username, done) {
  this.sqldb.get("SELECT IV,SECRET FROM USERS WHERE USERNAME = ?", username,
    function(err, row) {
      if (err) {
        return done(err, null);
      } else if (row === undefined) {
        return done(new Error('name not found'), null);
      } else {
        return done(null, {
          iv : row.IV,
          sharedSecret : row.SECRET
        });
      }
    });
};

module.exports = db;
