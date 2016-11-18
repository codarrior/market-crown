var log4js 				= require('log4js');
var log 				= log4js.getLogger('tracer.js');

var express 			= require('express');
var app 				= express();

var bodyParser 			= require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.all('*', function (req, res) {
	log.info(' > [%s] %s',req.method,req.originalUrl);
	log.info('body',req.body);
	log.info('header',req.headers);
	log.info('formData',req.formData);

	log.info('headers',req.headers.user);
	res.json({result:'ok'});
});


var port = process.env.PORT || 3000;
app.listen(port, function () {
	log.info('TRACER listening on port [%s]!',port);
});