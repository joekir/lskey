const express = require('express'),
      router = express.Router();


router.post('/',(req, res, next) => {
  res.status(200).send({
    'blob': 'abcdef213456',
    'redir': '/home.html'
  });
});

router.get('/', (req,res,next) => {
  res.redirect(301,'/');
});

module.exports = router;
