var _			= require('lodash');

var config = {
	PYTHON_UNSECURE_ENDPOINT:'/insecure',
	API_PREFIX:'/api/v1',
	LANDING_PREFIX:'',
	APP_PREFIX:'/app',
	NON_FINISHED_USER_EXP_MSEC:1000*60*60*24*7,
	SESSION_MONGO:{
		URL:'mongodb://localhost/mcm-sessions'
	},
	USER_MONGO:{
		URL:'mongodb://localhost/mcm-users'
	},

	PUBLIC_ADDRESS:'http://marketcrown.com',
	PYTHON_API:{
		HOST:'198.204.255.122',//'162.209.66.60',
		PORTS:['2198', '2199', '2200','2201']
	},
	//PUBLIC_ADDRESS:'http://104.239.245.54',
	PORT:80,
	REDIRECT_AUTH_SUCCESS:'/personalInfo',
	REDIRECT_AUTH_FAIL:'/',
	REDIRECT_URL_AFTER_SUCCESS_SIGNUP:'/app',
	REDIRECT_URL_AFTER_FAILED_SIGNUP:'/'
};

var config_dev = {
	SESSION_MONGO:{
		URL:'mongodb://mongo/mcm-sessions'
	},
	USER_MONGO:{
		URL:'mongodb://mongo/mcm-users'
	},
	//PYTHON_API:{
	//	HOST:'tracer',
	//	PORT:'5000'
	//},
	PUBLIC_ADDRESS:'http://localhost:3000',
};

config.PUBLIC_ADDRESS = 'http://localhost:3000';
config.PORT = 3000;

if(process.env.NODE_ENV=='development'){
	config = _.assign(config,config_dev);
}
module.exports = config;