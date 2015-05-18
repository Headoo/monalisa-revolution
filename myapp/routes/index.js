var express     = require('express');
var router      = express.Router();
var url         = require('url');
var fse         = require('fs-extra');
var fs          = require('fs');
var bodyParser  = require('body-parser');

router.use(bodyParser.json({
    keepExtensions: true,
    limit: 900000000,
    defer: true
})); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var session     = Date.now();

//Read client parameters 
var paramsPath  = 'clients/quinzedefrance/params.json'; 
var params      = fse.readJsonSync(paramsPath, {throws: false});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        parameters: params,
        session: session
    });
});

router.post('/directory/create', function(req, res, next) {
    var session_param = req.body.session;

    //Create temporary directory
    fse.ensureDir(__dirname + '/../public/tmp/' + session_param, function (err) {
        if (err) return console.error(err)
        res.send(true);
    });
});

router.post('/media/create', function(req, res, next) {
    var session_param   = req.body.session;
    var mediaBlob       = req.body.media;
    var extension       = req.body.extension;

    console.log(req.body);
    var url             = __dirname + '/../public/tmp/' + session_param + '/' + session_param + '.' + extension;

    fs.writeFile(url, mediaBlob, function (err) {
        console.log(true);
        res.send(true);
    });

});

router.post('/directory/rename', function(req, res, next) {
    /*
     //Create temporary directory
     fse.mkdirs(__dirname + '/../public/tmp/' + session, function (err) {
     if (err) return console.error(err)
     console.log("Directory successfully created!")
     })

     res.render('index', {
     parameters: params,
     session: session
     });*/
});


router.post('/file/txt/write', function(req, res, next) {
    /*
     //Create temporary directory
     fse.mkdirs(__dirname + '/../public/tmp/' + session, function (err) {
     if (err) return console.error(err)
     console.log("Directory successfully created!")
     })

     res.render('index', {
     parameters: params,
     session: session
     });*/
});

module.exports = router;
