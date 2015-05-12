var express     = require('express');
var router      = express.Router();
var url         = require('url');
var fse         = require('fs-extra');

 
//Read client parameters 
var paramsPath  = 'clients/quinzedefrance/params.json'; 
var params      = fse.readJsonSync(paramsPath, {throws: false});

console.log(params);

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        parameters: params
    });
});

module.exports = router;
