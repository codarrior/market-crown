var log4js 				= require('log4js');
var log 				= log4js.getLogger('user.model.js');

var mongoose 			= require('mongoose');
var Schema 				= mongoose.Schema;
const CONFIG			= require('../config.js');

var _					= require('lodash');

var userSchema = new Schema({
	provider: {name:String, id:String},
	mc_username: {type:String, index: true},
	displayName: String,
	banned:{type: Boolean, default:false},
	name:{
		familyName:String,
		givenName:String,
		middleName:String
	},
	emails: [
		Schema.Types.Mixed 										//value, type (home,work, etc)
		],
	photos:[Schema.Types.Mixed ],								// value
	createdAt: {type:Date, default: Date.now(), index: true},
	modifiedAt: {type:Date, default: Date.now()}
});


userSchema.pre('save', function (next) {
	this.modifiedAt =  Date.now();
	next();
});

userSchema.pre('update', function (next) {
	this.modifiedAt =  Date.now();
	next();
});

userSchema.statics.findOrCreate = function (profile,done) {
	log.info('findOrCreate');
	log.info('findOrCreate - create');
	//log.info('provider',profile.provider);
	//log.info('profile',profile);
	User.findOne({'$and':[{'provider.id':profile.id,'provider.name':profile.provider}]},function(err,user){
		if(err){
			log.info('findOrCreate - error');
			done(err);
		}else if(!user){

			profile.provider = {id:profile.id,name:profile.provider}
			var newUser = new User(profile)
			log.debug('profile',profile);
			log.debug('user',newUser)
			newUser.save(function(err,nu){
				log.debug('cb ',err,nu);
				done(err,nu);
			});
		}else{
			log.info('findOrCreate - exists',user);
			done(null, user);
		}
	})
};

userSchema.statics.deleteAllNonfinished = function (done) {
	if(!done){
		done = function(err){if(err){log.error(err);}}
	}
	User.remove(
		{
			$and:[
				{
					createdAt: {$lt: new Date().getTime() - CONFIG.NON_FINISHED_USER_EXP_MSEC}
				},
				{
					mc_username:{$exists:false}
				}
			]
		}).exec(done)
};

userSchema.statics.markBan = function(username, isBanned, done){
	User.findOneAndUpdate({mc_username:username},{banned:Boolean(isBanned)},done);
};

userSchema.methods.saveMcUsername = function(username, email, done){
	this.mc_username = username;
	var existEmail = _.findLast(this.emails,{value:email});
	if(!existEmail){
		if(!this.emails){this.emails=[]};
		this.emails.push({value:email})
	}
	this.markModified('emails');
	this.save(done);
};

userSchema.methods.getEmail = function(){
	if(this.emails && this.emails.length > 0){
		if(this.emails[0].value){
			return this.emails[0].value;
		}else{
			return '';
		}
	}else{
		return '';
	}
};




var User = mongoose.model('User', userSchema);
module.exports = User;