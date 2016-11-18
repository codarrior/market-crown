//var currentUser = "jeangrey";

var App = angular.module('App', ['ngSanitize',
	'ui.bootstrap',
	'ui.router',
	'chart.js',
	'ui.date',
	'ui.select',
	'angularUtils.directives.dirPagination',
	'angular-loading-bar',
	'ui-notification',
	'nvd3',
	'ngFileUpload',
	'infinite-scroll'
]);

App.config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 'NotificationProvider', function($urlRouterProvider, $stateProvider, $httpProvider,NotificationProvider) {
		NotificationProvider.setOptions({
			delay: 6000,
			startTop: 20,
			startRight: 10,
			verticalSpacing: 20,
			horizontalSpacing: 20,
			positionX: 'right',
			positionY: 'bottom'
		});



	$urlRouterProvider.otherwise('/stock-info');

	$stateProvider
		.state('stock-info', {
			url: '/stock-info',
			views: {
				'section': {
					controller: 'StockInfoWrapperCtrl',
					templateUrl: 'views/StockInfo.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				},
				'sidebar': {
					templateUrl: 'views/UserSidebar.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				}
			}
		})
		.state('forecasts', {
			url: '/forecasts',
			views: {
				'section': {
					templateUrl: 'views/Forecasts.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				},
				'sidebar': {
					templateUrl: 'views/Sidebar.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				}
			}
		})
		.state('queries', {
			url: '/queries',
			views: {
				'section': {
					templateUrl: 'views/Queries.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				},
				'sidebar': {
					templateUrl: 'views/Sidebar.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				}
			}
		})
		.state('pods', {
			url: '/pods',
			templateUrl: 'views/Pods.html',
			views: {
				'section': {
					templateUrl: 'views/Pods.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				},
				'sidebar': {
					templateUrl: 'views/noSidebar.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				}
			}

		})

		.state('pods.stats', {
			url: '/stats',
			views: {
				'section': {
					templateUrl: 'views/Stats.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				},
				'sidebar': {
					templateUrl: 'views/UserSidebar.html',
					resolve:{
						currentUser:function(UserDetailsService){
							return UserDetailsService.getUser(true);
						}
					}
				}
			}
		})

		.state('user', {
			url: '/user/:username',
			views: {
				'section': {
					templateUrl: 'views/User.html',

					controller: function($scope,currentUser) {
						$scope.currentUser = currentUser;
					//	var user = UserDetailsService.getUser();
					//
					//	$scope.username.id = $stateParams.username;
					//	console.log("App: " + $scope.username.id);
					//	if ($scope.username.id != currentUser) {
					//		currentUser = $scope.username.id;
					//	}
					},
					resolve:{
						currentUser:function(UserDetailsService,$stateParams,APIService,$q){
							if(!$stateParams.username){
								return UserDetailsService.getUser(true);
							}else{
								UserDetailsService.getUser(true);
								var user = {};
								return $q(function(resolve,reject){
									APIService.getHttp('/personal/profile/us/'+$stateParams.username).then(function(data){
										// console.log('user!',data);
										user = data;
										APIService.getHttp('/personal/tagline/'+$stateParams.username).then(function(data){
											user.tagline = data.tagline;
											user.profession = data.profession;
											// console.log('tagling',user);
											resolve(user)
										},reject);
									},reject);
								})

							}
						}
					}
				}


			}

		});
}]);

App.directive('ngReallyClick', [function() {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			element.bind('click', function() {
				var message = attrs.ngReallyMessage;
				if (message && confirm(message)) {
					scope.$apply(attrs.ngReallyClick);
				}
			});
		}
	}
}]);
