const log4js 			= require('log4js');
const log 				= log4js.getLogger('index.js');

const express 			= require('express');
const app 				= express();
const session 			= require('express-session');
const MongoStore 		= require('connect-mongo')(session);
const passport 			= require('passport');
const mustacheExpress 	= require('mustache-express');
var cookieParser 		= require('cookie-parser');

const common 			= require('./routes/common.js');
const personal			= require('./routes/personal.js');
const auth				= require('./routes/auth.js');
const admin				= require('./routes/admin.js');
const db				= require('./db/db.js');

const CONFIG			= require('./config.js');
const sessionsecret		= 'jst rndm scrt lne'

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
//app.use(bodyParser.json())
// cookieParser('jst rndm scrt lne',{secure:true, maxAge:60*60*24*7})
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/static/landing');
//app.set('views', __dirname + '/static/app');

app.use(CONFIG.LANDING_PREFIX, express.static(__dirname + '/static/landing'));
app.use('/userpics', express.static(__dirname + '/static/userpics'));
//app.use(CONFIG.APP_PREFIX, [checkIfAuthed, express.static(__dirname + '/static/app')]);
app.use(CONFIG.APP_PREFIX,  express.static(__dirname + '/static/app'));
app.use(cookieParser(sessionsecret));
app.use(session({
	secret:sessionsecret,
	resave: false,
	saveUninitialized:false,
	rolling: false,
	cookie : {
		secure: false,
		httpOnly: true,
		maxAge: 1000*60*60*24*7 // see below
	},
	store : new MongoStore({
		url: CONFIG.SESSION_MONGO.URL
	})
}));

app.use(passport.initialize());
app.use(passport.session());



log.warn(process.env.NODE_ENV);

//app.use(CONFIG.API_PREFIX+'/common',		common);
app.use(CONFIG.API_PREFIX+'/admin',			admin);
app.use(CONFIG.API_PREFIX+'/personal',		personal);
app.use(CONFIG.API_PREFIX+'/auth',			auth);

app.get(CONFIG.LANDING_PREFIX, function(req,res){
	if(req.user && req.user.mc_username){
		res.redirect(CONFIG.REDIRECT_URL_AFTER_SUCCESS_SIGNUP);
	}else {
		res.sendFile(__dirname + '/static/landing/marketcrown.html')
	}
});
app.get(CONFIG.LANDING_PREFIX+'/personalInfo', function(req,res){
	if(!req.user){
		res.redirect(CONFIG.REDIRECT_URL_AFTER_FAILED_SIGNUP);
	}else if(req.user.mc_username){
		res.redirect(CONFIG.REDIRECT_URL_AFTER_SUCCESS_SIGNUP);
	}else{
		var email = (req.user)?req.user.getEmail():'';
		res.render('personalinfo',{email:email});
	}
});


app.get(CONFIG.APP_PREFIX+'/purchase', function(req,res){
	if(!req.user || !req.user.mc_username){
		res.redirect(CONFIG.REDIRECT_URL_AFTER_FAILED_SIGNUP);
	}else{
		res.render('purchase', req.query);
	}
});


db.init(function(err){
	if(err){
		log.error(err)
	}else{
		startServer()
	}
});

function startServer(){
	var port = process.env.PORT || CONFIG.PORT || 3000;
	app.listen(port, function () {
		log.info('Example app listening on port [%s]!',port);
	});
}


function checkIfAuthed(req,res,next){
	console.log('checkIfAuthed',req.user);
	if(!req.user){
		return res.redirect(CONFIG.REDIRECT_AUTH_FAIL)
	}else if(!req.user.mc_username){
		return res.redirect(CONFIG.REDIRECT_AUTH_SUCCESS)
	}
	next();
}