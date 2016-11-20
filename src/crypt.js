const crypto = require('crypto'),
      process = require('process'),
      config = require(process.cwd() + '/config.js'),
      db = require(process.cwd() + '/src/db/db.js'),
      alg = 'aes-256-gcm';

var serverKey = config.serverKey; // Need to use var to work with `rewire` testing :(

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

var createNewUser = function(username){
  db.getUser(username,(err,iv,secret) => {
    if(err !== "name not found")
      throw "user exists"
  });
}

module.exports = {
  createNewUser
}
