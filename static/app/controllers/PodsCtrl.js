
App.controller ('PodsCtrl', ['$scope','$timeout','$http','APIService','UserDetailsService','PodsService',function ($scope,$timeout, $http, API,UserDetailsService,PodsService){
//App.controller ('PodsCtrl', ['$scope','$http','PodsService','APIService','UserDetailsService', function ($scope, $http,PodsService, API,UserDetailsService){

	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;
	var market = "us";
	$scope.podMarket = {};
	$scope.podMarkets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	//assigning default value
	$scope.podMarket.selected = $scope.podMarkets[0];
	$scope.prices = [];
	$scope.podsC = [];
	$scope.podsV = [];
	$scope.pendingData=[];
	$scope.filterData;
	$scope.podInfo;
	$scope.messages;
	// $scope.podInfo.messages=[];
	$scope.forecastStatus = "pending";
	$scope.forecastStatusVisibility = "pending";
	for (var i = 1; i <= 150; i++) {
		$scope.prices.push(i);
	}

	$scope.isOdd = function(x) { console.log("islog");return x % 2 === 1; };

	$scope.createPod = function () {
		if(!$scope.pod_name || $scope.pod_name == "Please insert Pod name")
		{
			//$scope.pod_name = "Please insert Pod name";
			return;
		} 
		if(!$scope.description || $scope.descript == "Please insert description")
		{	
			//$scope.description = "Please insert description";
			return;
		}
		if(!$scope.price || $scope.price == "Please insert price")
		{	
			//$scope.price = "Please insert price";
			return;
		}
		PodsService.createPodService($scope.pod_name,currentUsername, $scope.description, $scope.price, market);
	};
	$scope.changeMarket = function() {
		market = $scope.podMarket.selected.symbol;
		$scope.liveSearchSymbol();
		// console.log(market);
	};
	getAllPodsInfoV();
	/////////////////////////////////////////
	getAllPodsInfoC(market,currentUsername);
	
	function getAllPodsInfoC(market,username) {

		PodsService.getAllPodsInfoCService(market,username)
			.then(function(data) {
				$scope.podsC = data;
				if($scope.podsC.length >0)
				{
					$scope.podInfo =$scope.podsC[0];
					getPodsInfoMessages($scope.podInfo.pod_id);
				}
				$scope.pendingData = $scope.podsC;
// 				startPeriodicalRequests();
				// processMessages($scope.microblogs.data);
				// MicroblogsService.getRepliesCount($scope.microblogs.data);
				// sortMessages();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Pods Error', error);
			});
	};

	function getPodsInfoMessages(id) {
		PodsService.getPodsInfoMessagesService(id).then(
			function(data){
				$timeout(function() {
					$scope.messages = data.results;
				}, 0);
				
				
			}
		)
	};
	function getAllPodsInfoV() {

		PodsService.getAllPodsInfoVService()
			.then(function(data) {
				$scope.podsV = data;
// 				startPeriodicalRequests();
				// processMessages($scope.microblogs.data);
				// MicroblogsService.getRepliesCount($scope.microblogs.data);
				// sortMessages();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Pods Error', error);
			});
	};

	$scope.selectPod =  function(pod) {
		$scope.podInfo =  pod;
		getPodsInfoMessages($scope.podInfo.pod_id);
	}

	
	
	$scope.setPending = function() {
		if($scope.forecastStatus == "pending")
		{
			$scope.pendingData = $scope.podsC;
		}
		else
		{
			$scope.pendingData = $scope.podsV;
		}	
	}

	$scope.submitFilters = function(message){		
		PodsService.createPodsInfoMessageService($scope.podInfo.pod_id,"topic",$scope.currentUsername, message, market);
		getPodsInfoMessages($scope.podInfo.pod_id);
	};
}
]);

// var pods = [
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 7,
// 		"creator": "jeangrey",
// 		"price": 5,
// 		"pod_link": "N/A",
// 		"forecasts": 4,
// 		"pod_name": "Phoenix",
// 		"subscriber_list": [
// 			"admin",
// 			"jimcramer",
// 			"beast",
// 			"joker",
// 			"sonic",
// 			"jubilee",
// 			"batman"
// 		],
// 		"pod_id": "GnHhBh8vSpFVrRq8wPb24U",
// 		"created": "2015-07-27 06:16:06.454000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 3.667,
// 		"subscribers": 1,
// 		"creator": "jeangrey",
// 		"price": 5,
// 		"pod_link": "N/A",
// 		"forecasts": 6,
// 		"pod_name": "WolfofWallStreet",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "ZaKCJpJMBC8beuBffpA2JN",
// 		"created": "2015-10-05 07:21:15.191000",
// 		"accuracy": 16.666666666666664
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 12.57,
// 		"subscribers": 1,
// 		"creator": "silversurfer",
// 		"price": 5,
// 		"pod_link": "N/A",
// 		"forecasts": 40,
// 		"pod_name": "AxeCapital",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "TKumhkEbVUVanUQLrFXRuH",
// 		"created": "2016-03-17 05:39:35.527000",
// 		"accuracy": 22.5
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 14.339,
// 		"subscribers": 1,
// 		"creator": "robin",
// 		"price": 8,
// 		"pod_link": "N/A",
// 		"forecasts": 43,
// 		"pod_name": "JetLife",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "TCDGVF2fdqYEMzHZaq8KAB",
// 		"created": "2016-06-27 05:39:21.466000",
// 		"accuracy": 32.55813953488372
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "SuperSayan",
// 		"price": 8,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "LuckyCharms",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "zxfdgKat4EzmVQ5xZUrwiH",
// 		"created": "2016-06-27 05:46:08.964000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "SuperSayan",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "AlphaPicks Unlimited",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "f3VHm56hMFztGbuEUr6YnB",
// 		"created": "2016-09-04 00:13:31.695000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "supersayan",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "SuperFund Z",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "VYarboufUy44oyY5mJXDJo",
// 		"created": "2016-09-04 00:18:36.719000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 4.648,
// 		"subscribers": 1,
// 		"creator": "supersayan",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 8,
// 		"pod_name": "AlgoPicks",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "2qkM6EuYc9dGftc7Qr4WWb",
// 		"created": "2016-09-04 01:10:16.329000",
// 		"accuracy": 37.5
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "jubilee",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "GammaGroup_11",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "qHo5cT4UCmE4ugMyLPPAoC",
// 		"created": "2016-09-14 07:38:10.190000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "jubilee",
// 		"price": 10,
// 		"pod_link": "https://www.facebook.com",
// 		"forecasts": 2,
// 		"pod_name": "GammaGroup_12",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "cqwEr4sE8xGbM2JRsnTRTQ",
// 		"created": "2016-09-14 07:42:12.166000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "jubilee",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "x-factor fund",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "7Eg7QPRcjka3MaHAMwuSCi",
// 		"created": "2016-09-21 08:33:46.773000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "jubilee",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "GammaGroup_16",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "Jit3Co6kicVpHyvH44HKsC",
// 		"created": "2016-09-28 06:43:48.374000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "jubilee",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "GammaGroup_17",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "LL8MoCmL2nJWp9LrejrhF5",
// 		"created": "2016-09-28 06:45:53.436000",
// 		"accuracy": 0
// 	},
// 	{
// 		"status": "active",
// 		"gained_percentage": 0,
// 		"subscribers": 1,
// 		"creator": "jubilee",
// 		"price": 10,
// 		"pod_link": "N/A",
// 		"forecasts": 0,
// 		"pod_name": "GammaGroup_18",
// 		"subscriber_list": [
// 			"admin"
// 		],
// 		"pod_id": "Fu6rYATuEpNxZ9Nmuyh6JA",
// 		"created": "2016-09-28 06:47:21.697000",
// 		"accuracy": 0
// 	}
// ];