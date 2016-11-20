const assert = require('assert'),
      process = require('process'),
      rewire = require('rewire');


// Library under test
const crypt = rewire(process.cwd() + '/src/crypt.js');

// Extract private functions
var encrypt = crypt.__get__('encrypt');
var decrypt = crypt.__get__('decrypt');



describe('crypt.js', function() {
  // override
  crypt.__set__("serverKey"
          ,"874a6736adcca81de26338fb825bbb69935ec0869b1ca2b0bd7edaf57ceca606")

  var ctext,tag;
  var iv = '7ed545ec51511aefb9b94da9'
  var ptext = "foobar";
  var aad = "joe@foo.com"

  describe('#encrypt(ptext,username)', function() {
    it('should return iv,ciphertext,tag and AAD properties', function() {
      var result = encrypt(ptext,iv,aad);

      // Computed ahead of time
      assert(result.ctext === 'f917d44e362f');
      assert(result.tag === 'daf58185b1603654a2ce8acb68653387');

      ctext = result.ctext;
      tag = result.tag;
    });
  });

  describe('#decrypt(ctext,iv,tag,aad)', function(){
    it('should decrypt to the original input', function(){
      var result = decrypt(ctext,iv,tag,aad);
      //console.log(result);
      assert(result.ptext === ptext);
    });
  });
});
