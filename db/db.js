var log4js 				= require('log4js');
var log 				= log4js.getLogger("DB");
var CONFIG 				= require('../config.js');

var mongoose 			= require('mongoose');


var db;
var exp = {
	init:function(done){
		mongoose.Promise = global.Promise;
		mongoose.connect(CONFIG.USER_MONGO.URL);
		console.log('CONFIG.USER_MONGO.URL',CONFIG.USER_MONGO.URL);
		db = mongoose.connection;
		db.on('error', log.error.bind(log, 'connection error:'));
		db.once('open', function (err) {
			log.info('DB opened');
			done(null)
		});
	}
};

module.exports = exp;