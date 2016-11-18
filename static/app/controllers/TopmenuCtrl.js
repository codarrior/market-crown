App.controller ('TopmenuCtrl',['$scope', '$http', 'MicroblogsService', 'GeneralDataService', 'UserDetailsService', function ($scope, $http, MicroblogsService, GeneralDataService,UserDetailsService){
	var user = UserDetailsService.getUser(true);
	$scope.currentUsername='';
	if(user.then){
		user.then(function(data){
			console.log('then',data);
			$scope.currentUsername = data.mc_username;
		})
	}else if(user.mc_username){
		console.log('then mc_username',user);
		$scope.currentUsername = user.mc_username;
	}else{
		console.log('then -- ')
		$scope.currentUsername = ''
	};

}]);