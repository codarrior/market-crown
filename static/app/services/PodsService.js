App.factory('PodsService', ['APIService', function (API) {
	
	return {
		createPodService: function(pod_name,pod_owner,description,price,market){
			API.postHttp('/personal/create/pod',
			{
				"pod_name": pod_name,
				"pod_owner":pod_owner,
				"description":description,
				"price":price,
				"market":market
			}).then(function(data){
				 console.log(data);
		
			})
		},

		getAllPodsInfoVService: function() {
			return API.getHttp('/personal/pod/info/us/all',
			{
					
			});
		},


		getPodsInfoMessagesService: function(id){
			return API.getHttp('/personal/pod/feed/query/'+id,{

			});
		},

		createPodsInfoMessageService: function(pod_id,theme_type,user,message,market){
			console.log(pod_id+","+theme_type);	
			console.log(user+","+message+","+market);	
			return API.postHttp('/personal/pod/feed/entry',{
				"pod_id": pod_id,
				"theme_type": theme_type,
				"user": user,
				"message": message,
				"market":market
			});
		},

		getAllPodsInfoCService: function(market,username) {
			return API.getHttp('/personal/pod/info/'+market+'/'+username+'/all',
			{
					
			});
		},

		getPodsDataService: function() {
			return API.postHttp('/personal/pod/info/us/all',
			{
					"user" : user,
					"market" : market,
					"query_type" : query_type
			});
		},

		geetPodsFeedMessagesService: function() {
			return API.getHttp('personal/pod/feed/query/Fu6rYATuEpNxZ9Nmuyh6JA',
			{

			});
		}
	}
}]);
