App.controller ('UserInfoCtrl', ['$scope','Upload','$timeout','APIService','UserDetailsService',function StockInfoCtrl ($scope,Upload,$timeout, API,UserDetailsService){

	var stock_info_market = "us";   	//default market value
	var stock_info_symbol = "googl";	//default symbol values

	var urlBase = (window.location.host=='192.168.99.100:3000')?'http://192.168.99.100:3000/api/v1':'https://marketcrown.com/api/v1';
	// var urlBase = (window.location.host=='192.168.0.33:3000')?'http://192.168.0.33:3000/api/v1':'https://marketcrown.com/api/v1';

	//default get call
	var stock_info_full_link = "default info call";
	console.log("Default get call " + stock_info_full_link);

	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;

	$scope.basicUserInfo = UserDetailsService.getUser();
	console.log($scope.basicUserInfo);
	$scope.errorUpload = false;



	//getData function. Calling default data
	$scope.getData = function(request_link, type) {
		$scope.$emit('loadProfileInfo');
		API.getHttp(request_link)
			.then(function (data) {
				$scope.chartData = data;
				console.log("Successful GET call " + stock_info_full_link);

				if (type === "sector_preference") {

					//calculate percentage
					var totalSectorPreference = $scope.chartData.healthcare + $scope.chartData.financial + 10 + $scope.chartData.services + 20 + $scope.chartData.conglomerates + 45 + $scope.chartData.technology + $scope.chartData.utilities;
					var healthcarePercent = $scope.chartData.healthcare * 100 / totalSectorPreference;
					var financialPercent = $scope.chartData.financial * 100 / totalSectorPreference;
					var industrialGoodsPercent = 10 * 100 / totalSectorPreference;
					var servicesPercent = $scope.chartData.services * 100 / totalSectorPreference;
					var consumerGoodsPercent = 25 * 100 / totalSectorPreference;
					var conglomeratesPercent = $scope.chartData.conglomerates * 100 / totalSectorPreference;
					var basicMaterialsPercent = 45 * 100 / totalSectorPreference;
					var technologyPercent = $scope.chartData.technology * 100 / totalSectorPreference;
					var utilitiesPercent = $scope.chartData.utilities * 100 / totalSectorPreference;

					$scope.sectorPreferenceData = [healthcarePercent.toFixed(1)  , financialPercent.toFixed(1), industrialGoodsPercent.toFixed(1) ,  servicesPercent.toFixed(1), consumerGoodsPercent.toFixed(1), conglomeratesPercent.toFixed(1), basicMaterialsPercent.toFixed(1), technologyPercent.toFixed(1), utilitiesPercent.toFixed(1) ];
				}

				else if (type === "correct_incorrect") {
					var totalCorrectIncorrect = $scope.chartData.true + $scope.chartData.false;
					var truePercent = $scope.chartData.true * 100 / totalCorrectIncorrect;
					var falsePercent = $scope.chartData.false * 100 / totalCorrectIncorrect;

					$scope.correctData = [truePercent.toFixed(1), falsePercent.toFixed(1)];
				}


				else if (type == "forecast_sentiment") {
					var totalForecastSentiment = $scope.chartData.bearish + $scope.chartData.bullish;
					var bearishPercent = $scope.chartData.bearish * 100 / totalForecastSentiment;
					var bullishPercent = $scope.chartData.bullish * 100 / totalForecastSentiment;

					$scope.forecastSentimentData = [bearishPercent.toFixed(1), bullishPercent.toFixed(1)];
				}

				else if (type == "market_cap_preference") {
					var totalMarketCapPreference = $scope.chartData.mega + $scope.chartData.nano + $scope.chartData.mid + $scope.chartData.large + $scope.chartData.micro + $scope.chartData.small;
					var megaPercentage = $scope.chartData.mega * 100 / totalMarketCapPreference;
					var nanoPercentage = $scope.chartData.nano * 100 / totalMarketCapPreference;
					var midPercentage = $scope.chartData.mid * 100 / totalMarketCapPreference;
					var largePercentage = $scope.chartData.large * 100 / totalMarketCapPreference;
					var microPercentage = $scope.chartData.micro * 100 / totalMarketCapPreference;
					var smallPercentage = $scope.chartData.small * 100 / totalMarketCapPreference;
					$scope.marketCapPreferenceData = [megaPercentage.toFixed(1), nanoPercentage.toFixed(1), midPercentage.toFixed(1), largePercentage.toFixed(1), microPercentage.toFixed(1), smallPercentage.toFixed(1)];
				}


				else if (type == "time_of_the_day_preference") {
					var totalTimeOfTheDayPreference = $scope.chartData.close + $scope.chartData.midday + $scope.chartData.morning;
					var closePercentage = $scope.chartData.close * 100 / totalTimeOfTheDayPreference;
					var middayPercentage = $scope.chartData.midday * 100 / totalTimeOfTheDayPreference;
					var morningPercentage = $scope.chartData.morning * 100 / totalTimeOfTheDayPreference;

					$scope.timeOfTheDayPreferenceData = [closePercentage.toFixed(1), middayPercentage.toFixed(1), morningPercentage.toFixed(1)];
				}

				$scope.$emit('unloadProfileInfo')
			},function(err){
			console.log("Get Call Error",err);
			$scope.$emit('UNLOAD');
		});
	};


	$scope.getSectorPreference = function() {
		$scope.sectorPreferenceLabel = ["Healthcare", "Financial", "Industrial Goods", "Services", "Consumer Goods", "Conglomerates", "Basic Materials", "Technology", "Utilities"];
		console.log("Called First");
		$scope.getData("/personal/sector/"+currentUsername+"/" + stock_info_market, "sector_preference");
	};


	$scope.getCorrect = function() {
		$scope.correctLabel = ["Correct", "Incorrect"];
		console.log("Called Second");
		$scope.getData("/personal/correctperformance/"+currentUsername+"/" + stock_info_market + "/02-05-14until09-21-22", "correct_incorrect");
	};

	$scope.getForecastSentiment = function() {
		$scope.forecastSentimentLabel = ["Bearish", "Bullish"];
		console.log("Called Third");
		$scope.getData("/personal/sentiment/"+currentUsername+"/" + stock_info_market + "/01-02-14until01-02-22", "forecast_sentiment");
	};

	$scope.getMarketCapPreference = function() {
		$scope.marketCapPreferenceLabel = ["Mega", "Nano", "Mid", "Large", "Micro", "Small"];
		console.log("Called Fourth");
		$scope.getData("/personal/marketcap/"+currentUsername+"/" + stock_info_market + "/01-02-14until01-02-22", "market_cap_preference");
	};

	$scope.getTimeOfTheDayPreference = function() {
		$scope.timeOfTheDayPreferenceLabel = ["Close", "Midday", "Morning"];
		console.log("Called Fifth");
		$scope.getData("/personal/timeofday/"+currentUsername+"/" + stock_info_market + "/01-02-14until01-02-22", "time_of_the_day_preference");
	};


	//returning at a glance section data
	$scope.getAtGlance = function () {
		API.getHttp("/personal/profile/" + stock_info_market + "/"+currentUsername)
			.then(function (data) {
				console.log(' > *** ',data);
				$scope.atGlanceData = data;
			},function(){
			console.log("Live search API error");
		});
	};

	$scope.uploadFiles = function(file, errFiles) {
        $scope.uploadInProgress = true;
		  $scope.uploadProgress = 0;

		  var $file;
		  if (angular.isArray(file)) {
		    $file = file[0];
		  }
		  
		  var key = currentUsername.toLowerCase() + new Date().getTime();

		  $scope.upload = Upload.upload({
		    url: urlBase + '/personal/avatar/' + key,
		    method: 'POST',
		    data: {
		      type: 'profile'
		    },
		    file: file
		  }).then(function(data) {
			  var s3_url = 'https://s3-us-west-1.amazonaws.com/marketcrown-avatars/' + key;
			  console.log(s3_url);
			  var old_avatar = '';
			  if ($scope.basicUserInfo.photos.length > 0) {
					old_avatar = $scope.basicUserInfo.photos[0].value;
					$scope.basicUserInfo.photos[0].value = s3_url;
				} else {
					var photo = {"value":s3_url};
					$scope.basicUserInfo.photos.push(photo);
				}
				$scope.errorUpload = false;
				API.postHttp("/personal/update/avatar",{
					"user": currentUsername,
					"url" : s3_url
				})
				.then(function(data){
					if (old_avatar != '') {
						var splits = old_avatar.split("/");
						var keyname = splits[splits.length-1];
						console.log(keyname);
						API.postHttp("/personal/removeOldavatar/" + keyname, {
							
						})
						.then(function(data){
							console.log(data);
						}, function(err) {
							console.log(err);
						});
					}
				},function(){
					console.log("uploading avatar error");
				});
		  },function(err) {
		    $scope.uploadInProgress = false;
			$scope.errorUpload = true;
		    console.log('Error uploading file: ' + err);
		  });
    };
	//$scope.getABasicUserInfo = function () {
	//	API.getHttp("/personal/me/")
	//		.then(function (data) {
	//			$scope.basicUserInfo = data;
	//		},function(){
	//			console.log("Live search API error");
	//		});
	//};

	$scope.$watch('userInfoMarketSelected', function(newValue, oldValue) {
		if (newValue !== oldValue) {
			if ($scope.userInfoMarketSelected == $scope.userInfoMarket [0]) {
				stock_info_market = "us";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [1]) {
				stock_info_market = "ca";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [2]) {
				stock_info_market = "uk";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [3]) {
				stock_info_market = "de";
			}

			else if ($scope.userInfoMarketSelected == $scope.userInfoMarket [4]) {
				stock_info_market = "hk";
			}
		}

		$scope.getAtGlance();
		//$scope.getABasicUserInfo();
		$scope.getSectorPreference();
		$scope.getCorrect();
		$scope.getForecastSentiment();
		$scope.getMarketCapPreference();
		$scope.getTimeOfTheDayPreference();
	});

	$scope.updateUserInfoMarket = function() {

		$scope.userInfoMarket = [
			{name: "US Market", link: "us"},
			{name: "CA Market", link: "ca"},
			{name: "UK Market", link: "uk"},
			{name: "DE Market", link: "de"},
			{name: "HK Market", link: "hk"}
		];

		$scope.userInfoMarketSelected = $scope.userInfoMarket [0];

	};

	$scope.updateProfessionTagline = function() {
		var apiUrl = "/personal/update/tagline";
		API.postHttp(apiUrl,
			{
				"user": currentUsername,
				"profession": $scope.basicUserInfo.profession,
				"tagline": $scope.basicUserInfo.tagline
			}).then(function(data){
			console.log(data);
		},function(err){
			console.error(err);
			//alert("Follow error");
		});
	};

	$scope.dismisEditTag = function() {
		$scope.getUserProfessionTagline();
	};

	$scope.isEditProfessionCheck = function() {
		if ($scope.basicUserInfo.mc_username == $scope.currentUsername) {
			$scope.isEditProfession=true;
		}
	};
	$scope.isEditTaglineCheck = function() {
		if ($scope.basicUserInfo.mc_username == $scope.currentUsername) {
			$scope.isEditTagline=true;
		}
	};

	$scope.getUserProfessionTagline = function() {
		var url = "/personal/tagline/" + currentUsername;
		UserDetailsService.getAtGlanceService(url)
			.then(function(data) {
				// promise fulfilled
				$scope.basicUserInfo.profession = data.profession;
				$scope.basicUserInfo.tagline = data.tagline;

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Get At Profession and tagline', error);
			});
	}

	$scope.getUserProfessionTagline();

	$scope.getAllData = function() {
		//calling profile info functions
		$scope.getAtGlance();
		//$scope.getABasicUserInfo()
		$scope.getSectorPreference();
		$scope.getCorrect();
		$scope.getForecastSentiment();
		$scope.getMarketCapPreference();
		$scope.getTimeOfTheDayPreference();
	}

	$scope.updateUserInfoMarket();
	$scope.getAllData();

}]);