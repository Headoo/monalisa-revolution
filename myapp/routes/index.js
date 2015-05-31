var express             = require('express');
var router              = express.Router();
var url                 = require('url');
var fse                 = require('fs-extra');
var fs                  = require('fs');
var bodyParser          = require('body-parser');
var cache               = require('memory-cache');

//PARSE INITIALIZATION
var Parse               = require('node-parse-api').Parse;
var PARSE_APP_ID        = "w5btRxd9dtAURWNO7Zyzjs8rfBOl7AfrKM3inxEV"; //APP ID
var PARSE_REST_KEY      = "eC4wEVQRQ3Brv5JV8gxaaxUvtcwu4KwRW9eUY4oE"; //REST API KEY
var PARSE_MASTER_KEY    = "8ilAeBCISlrya0SPW5SdstoMXVL4LV89t0qlyuMz"; //MASTER API KEY
var options             = {
    app_id: PARSE_APP_ID,
    api_key: PARSE_REST_KEY
};
var parseApp            = new Parse(options);


var clientId            = '';
var session             = Math.floor(Date.now() / 1000);

//Read client parameters
var paramsPath          = 'clients/quinzedefrance/params.json';
var params              = fse.readJsonSync(paramsPath, {throws: false});


/* GET home page. */
router.get('/', function(req, res, next) {
    clientId = req.query.client;

    //If there are already cached datas, get them without calling Parse
    if (cache.size() > 0) {
        res.render(clientId, {
            parameters: cache.get('parseParams'),
            session: session
        });
    } else {
        // Get datas from Parse application
        parseApp.find('ClientDatas', {clientName: clientId }, function (err, response) {
            if (null === err) {
                var parseParams = response.results[0];

                cache.put('parseParams', parseParams);

                res.render(clientId, {
                    parameters: cache.get('parseParams'),
                    session: session
                });
            } else {
                //No internet connection, please connect first !
                res.render('networkError', {
                    parameters: 'hello'
                });
            }
        });
    }
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
