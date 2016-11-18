const log4js 				= require('log4js');
const log 					= log4js.getLogger('auth.js');

const express				= require('express');
const router 				= express.Router();
var request					= require('request');
var _						= require('lodash');

const User 					= require('../db/user.model.js');
const CONFIG				= require('../config.js');
//
var passport 				= require('passport');
var bodyParser 				= require('body-parser');


var FacebookStrategy 		= require('passport-facebook').Strategy;
var TwitterStrategy 		= require('passport-twitter');
//var GooglePlusStrategy 	= require('passport-google-plus');
var GoogleStrategy 			= require('passport-google-oauth20').Strategy;

var urlencodedParser 		= bodyParser.urlencoded({ extended: false });
//bodyParser.json({ type: 'application/json'});//
passport.serializeUser(function(user, done) {
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		//if(user.banned){
		//	done(err,null);
		//}else{
			done(err, user);
		//}

	});
});



passport.use(new FacebookStrategy({
		clientID: 1074187149262332,
		clientSecret: "94eed7a7170b0e2b76f4f4cc25240a51",
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

passport.use(new TwitterStrategy({
		consumerKey: 'HGsgXjGXU4qsGePQ3RKVLnvBy',
		consumerSecret: '1FyIuFVfRbAogS6yF36yQvBvV5Zndy3e9OT7qjHCKnc1uj35tS',
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/twitter/callback"
	},
	function(token, tokenSecret, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

passport.use(new GoogleStrategy({
		//clientID: '115832520737389103800',
		//clientSecret: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDbW+PBuMIUqGRc\nQJpWZ4giEX2s2ro1frMfjQ6O74LR2M5UE+8L8ek7DdRvuDSJDsqD8D/REOFS4uOd\nzYrBYiYmKdOilKksyDHlocka5gcXT3qmbJoMXgj24VWHwUvzJqe+9E0L0wgD6d15\nNWwUpNmf7VzLg0rSEBBh7Msaqong41hWkfJuKywOpdoacdwawOe3AVb41c7VjKy/\nlNRAwQUB9nPjtljneKYZlpYcqZMqquJpnpOP61ZKZQhKvvjh3W/2fabhkquvjB44\ndByh281Y10RTxOFc6CiVGGI04wUf9CAIO2wo9wDK8737Kb0hmgq3SCznaHFrdJWX\no1sWhKFBAgMBAAECggEADUtwbllISgA6tOylbf8wXQA6YbOP/ZYEPTFLZJZXk2hU\nePwMTOkIfa/E5FCBvpzK4Vw6Qe2H+oIN0Y6Xjkjojv+R+BSSfEhV3dkEW0D9xQfo\nIxYJ8B3y5SObD3NDqyT4nbYoxUKxBauy5Jm8RzQGjI7SRPNcIYcftw+m76LOYHbK\nLX7M4LuxxxwfR02EjdD1sLJ5Cp7yJ5wsXKlQhzu47eu2ZiHszh/CeG5SJevVz9C3\nB3K63TwxiScf4F8tVo3GHTtj1Z28UhZx4756Fi0GLliSv05zEv/ctnWma+sAEcJf\nkM0tbq+4aKXHTTXYc39nr8gUovfvhitzKQIwdwGKwQKBgQD42E4KI7Cxt0dbAwUy\nyffTPxGJ2+VJurR3RitvMTK/L2y1N8LbqcoPUILSoo+j1yBbiEN4fHy0APbTZA6L\nqdXeAlq+9CdVDwchej/OVtLOdPs22Et4aAkyu3tEzw/0GJatoD2V4RwkmDjAmmNC\nXmrjSnn6P8mYGsKUwdOH2Y2r9QKBgQDhqotskyR3lR6qLpNXYGn7WstWtdGIjKTo\nVj4BxUq3qol3ZhCwinirZcV7iKsYmPxLDyG5XsWX40wcLzF5/16qQFl956V6Nygt\n17QPFsITjhdG+wKqmnM3cMrygElmUCqS8VqAssUBTF6y8Apu0R1rBbLX+ATHZBjI\nFrENKsn8nQKBgA6t49yhQlkZcLIjuXjHhUEG5Wf2es4gn2ix0PocMtwoVgdSpMIE\ngBDrNOxr/oExvYzouuIupcSQkf7iViFTAXS5OtUs3e0cl9UXuw/W+1SGfhM8KyeN\nK428lYb3l/9UO/8+BqQCxYA7Io3qDZTqsO97gzqJ7MB2Q6g2zt2ircLJAoGBAJOP\nl1fJ56CiS8jwZ7xM+UA5IJl0jq0BepvKOQWjYrYyt2zxupwWD83T4Ixk06xj7SWP\noXe7Nu2Y3Z3YZjvl9prRNTOVE6mVA5rmX4E2WnW7BhGN9TJliE2KXcqwhE54wT4Q\nwCNDwnqU25+aQtgvuVLQCSAbt9RB6cp8vA1mG2opAoGBAN75J5dGouIzFTb4zRes\nMkNVWoT+olaXq513/K4Y1pZAN4PyQz0nVs3rYx4MPG3/PcAoYt3nHbRPtrf4O5H0\n5EYkbiDn4TJ4x32TqTS6CmN50Og9znaOBQL1cV7FGlQ7xqZvGW4HpU2rgrJei4qB\ncCEyfO7WJkXru6cmya9gpNnH\n-----END PRIVATE KEY-----\n',
		//callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/google/callback"
		clientID: '1002436193878-ba0blta375fu9bbvkuv4k883fnpa03gl.apps.googleusercontent.com',
		clientSecret: '8lYRVEfZsQG5pcXtitAIcRUs',
		callbackURL: CONFIG.PUBLIC_ADDRESS+CONFIG.API_PREFIX+"/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done) {
		User.findOrCreate(profile, function(err, user) {
			if (err) { return done(err); }
			done(null, user);
		});
	}
));

router.get('/facebook',
	passport.authenticate('facebook'));
router.get('/facebook/callback',
	passport.authenticate('facebook', { successRedirect: CONFIG.REDIRECT_AUTH_SUCCESS,
		failureRedirect: CONFIG.REDIRECT_AUTH_FAIL }));

router.get('/twitter',
	passport.authenticate('twitter'));
router.get('/twitter/callback',
	passport.authenticate('twitter', { successRedirect: CONFIG.REDIRECT_AUTH_SUCCESS,
			failureRedirect: CONFIG.REDIRECT_AUTH_FAIL }));

router.get('/google',
	passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback',
	passport.authenticate('google', { successRedirect: CONFIG.REDIRECT_AUTH_SUCCESS,
		failureRedirect: CONFIG.REDIRECT_AUTH_FAIL }));


router.get('/logout', function(req, res){
	req.logout();
	res.redirect(CONFIG.REDIRECT_URL_AFTER_FAILED_SIGNUP);
});


var finish_url = 'http://'+CONFIG.PYTHON_API.HOST+':'+_.sample(CONFIG.PYTHON_API.PORTS);
router.post('/finish',urlencodedParser, function(req,res){
	//console.log('post finish',req.body);
	if(!req.user){
		return res.status(401).send('no cookies');
	}
	var obj = {
		"username": req.body.username,
		"email": (req.body.email && req.body.email.length>0)?req.body.email:req.user.getEmail(),
		"location":"San Francisco",
		"sector":["technology","financial"],
		"marketcap":["mega"]
	};
	console.log('reg user',obj);
	request({
		url:finish_url+'/create/user',
		method:'POST',
		body:obj,
		json:true
	},function (error, response, body) {
			console.log('Python says [body]',body);
			console.log('Python says [response]',response);
			console.log('Python says [error]',error);

			if(error){
				return res.json({error:body})
			}
			if(body=="User successfully added"){
				req.user.saveMcUsername(req.body.username,req.body.email,function(err){
					if(err){
						console.error(err);
						res.json({error:err})
					}else{
						User.deleteAllNonfinished();
						return res.json({redirect:CONFIG.REDIRECT_URL_AFTER_SUCCESS_SIGNUP});
					}

				});
			}else{
				return res.json({error:body})
			}
	});
});
module.exports = router;