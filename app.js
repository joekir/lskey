const express = require('express'),
      helmet = require('helmet'),
      hsts = require('hsts'),
      csp = require('helmet-csp'),
      logger = require('morgan'),
      cors = require('cors'),
      bodyParser = require('body-parser');

var app = express();

var registration = require('./routes/registration'),
    home = require('./routes/home'),
    auth = require('./routes/middleware/auth');

app.use(cors());
app.use(helmet());
/*app.use(hsts({
  maxAge: 15552000,  // 180 days
  setIf: function (req, res) {
    // for the nginx reverse proxy
    return req.secure || (req.headers['x-forwarded-proto'] === 'https')
  }
}));
*/

app.use(logger('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


app.use("/api/register",registration);
app.use("/api/home",home);

app.get("/", (req,res) => {
  res.redirect('/index.html');
});

// Catch other stuff and deny.
app.use(function(err, req, res, next) {
    console.log(err);
    res.redirect("back");
});

var port = 2000;

app.listen(port, function () {
  console.log('Listening on port: ' + port);
})
