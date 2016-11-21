const crypto = require('crypto'),
      cwd = require('process').cwd(),
      config = require(cwd + '/config.js'),
      alg = 'aes-256-gcm';

var serverKey = config.serverKey, // Need to use var to work with `rewire` testing :(
    db = require(cwd + '/src/db/db.js')(cwd + '/src/db/users.db');

function encrypt(ptext,iv,aad){
  var cipher = crypto.createCipheriv(alg, Buffer.from(serverKey,'hex')
                                        , Buffer.from(iv,'hex'));

  cipher.setAAD(Buffer.from(aad,'utf8'));

  var encrypted = cipher.update(ptext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  var tag = cipher.getAuthTag();

  return {
    ctext: encrypted,
    tag: tag.toString('hex')
  };
}

/*
  If this errors, it is most likely that the AAD or tag are invalid. Hence reject!
*/
function decrypt(ctext,iv,tag,aad){
  var decipher = crypto.createDecipheriv(alg,Buffer.from(serverKey,'hex'),Buffer.from(iv,'hex'));
  decipher.setAuthTag(Buffer.from(tag,'hex'));
  decipher.setAAD(Buffer.from(aad,'utf8'));

  var decrypted = decipher.update(ctext,'hex','utf8');
  decrypted += decipher.final('utf8');
  return {
    ptext: decrypted
  }
}

var createNewUser = function(username,done){
  var iv = crypto.randomBytes(12).toString('hex');
  var sharedSecret = crypto.randomBytes(20).toString('hex');
  db.addUser(username, iv, sharedSecret, (err,result) => {
    if (err)
      return done(new Error("Unable to create user: " + username),null);

    done(null, encrypt(sharedSecret,iv,username));
  });
}

/*
  These errors are not side-channel proof.
*/
var validateUser = function(username,ciphertext,tag,done){
  db.getUser(username,(err,res) => {
    if(err)
      return done(false);

    try {
      var result = decrypt(ciphertext,res.iv,tag,username);
      if(result.ptext === res.sharedSecret)
        return done(true);
    }
    catch (err){
      console.log(err);
    }

    return done(false);
  });
};

module.exports = {
  createNewUser,
  validateUser
}
