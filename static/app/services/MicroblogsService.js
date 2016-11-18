App.factory('MicroblogsService', ['APIService', '$q', function (API,$q) {
	return {
		createTopic: function(user, message, market) {
			return API.postHttp('/personal/fe2ed/entry',
			{
					"theme_type" : "topic",
					"user" : user,
					"message": message,
					"image": null,
					"avatar": null,
					"market": market
			});
		},

		getDefaultMicroblogsService: function(user, market, query_type) {
			return API.postHttp('/personal/fe2ed/query',
			{
					"user" : user,
					"market" : market,
					"query_type" : query_type
			});
		},

		getMicroblogsService: function(query) {
			return $q(function(resolve, reject) {
				API.postHttp('/personal/fe2ed/query', query).then(function(res){
					resolve(res)
				},reject);
			});
		},

		getPushMessages: function(type,market, tstamp, data){
			var path = ''
			// console.log('type',type,data)
			if(type=='default'){
				path = '/personal/push/' + type + '/' + market + '/' + tstamp;
			}else if(type=='symbols'){
				path = '/personal/push/' + type + '/' + market + '/' + tstamp+'/id='+JSON.stringify(data.symbol);
			}else if(type=='onlyme'){
				path = '/personal/push/' + market + '/' + tstamp+'/id='+JSON.stringify([data.username]);
			}else if(type=='userlist'){
				path = '/personal/push/' + market + '/' + tstamp+'/id='+JSON.stringify(data.userlist);
			}else if(type=='sectors'){
				path = '/personal/push/' + type + '/' + market + '/' + tstamp+'/id='+JSON.stringify(data.sector);
			}else if(type=='response'){
				path = '/personal/push/' + type + '/' + market + '/' + tstamp+'/id='+JSON.stringify(data.response);
			}
			return API.getHttp(path,null,true);
		},
		getRepliesCount: function(data){
			if(!data[0] || !data[0].market){return;}
				API.postHttp('/personal/message/reply/count', {
					message_ids:_.chain(data).map('theme_id'),
					market:data[0].market
				},true).then(function(res){
					// console.log('getRepliesCount+',res);
					_.each(res,function(rply){
						var msg = _.find(data,{theme_id:rply.theme_id})
						if(msg){
							msg.replies = rply.replies;
						}
					})
				});
			// console.log('getRepliesCount',data);
		},

		getOnlyMeMicroblogsService: function(user, market) {
			return API.postHttp('/personal/fe2ed/query',
				{
					"user" : user,
					"market" : market,
					"query_type" : "onlyme"
				});
		},

		getRepliesService: function(user, market, theme_id) {
			return API.postHttp('/personal/fe2ed/query',{
					"user" : user,
					"market" : market,
					"query_type" : "response",
					"theme_id" : theme_id
				});
		},

		sendReplyService: function(user, theme_id, replyData) {
			return API.postHttp('/personal/fe2ed/reply',{
					"theme_type" :"reply",
					"theme_id" : theme_id,
					"user" : user,
					"reply": replyData,
					"image":null,
					"avatar":null
				});
		}
	};
}]);
