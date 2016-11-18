App.directive('microblog', ['APIService','UserDetailsService',function (API,UserDetailsService){
	return {
		scope:{},
		restrict: 'E',
		replace:true,
		controller:"MicroblogsCtrl",
		templateUrl:'controllers/microblog.tmpl.html',
		link: function (scope, elem, attrs) {

		}
	}
}]);