
var selectedToFollow = "";
//initializing relative days


var today = Date.parse('today').toString('MM/dd/yy');
var yesterday = Date.parse('yesterday').toString('MM/dd/yy');
var lastMonday = Date.parse('last monday').toString('MM/dd/yy');
var lastWeekMonday = Date.monday().addDays(-7).toString('MM/dd/yy');
var lastWeekFriday = Date.friday().addDays(-7).toString('MM/dd/yy');
var lastWeekSunday = Date.sunday().addDays(-7).toString('MM/dd/yy');
var last7Days = Date.today().addDays(-7).toString('MM/dd/yy');
var last14Days =  Date.today().addDays(-14).toString('MM/dd/yy');
var last30Days =  Date.today().addDays(-30).toString('MM/dd/yy');
var firstDayOfCurrentMonth = Date.today().moveToFirstDayOfMonth().toString('M/dd/yy');
var firstDayOfLastMonth = Date.parse('- 1months').moveToFirstDayOfMonth().toString('MM/dd/yy');
var lastDayOfLastMonth = Date.parse('- 1months').moveToLastDayOfMonth().toString('MM/dd/yy');



App.controller ('BasicQueriesCtrl',['$scope', 'APIService','UserDetailsService', function ($scope, API,UserDetailsService){
	/*
	 Custom Queries Start
	 ---------------------------------------
	 */

	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;

	var startDate = last7Days;
	var endDate = today;
	$scope.isBasicQuery = true;

	//true to make it work on initial load
	var roundNumber = true;
	var roundNumberOnly = true;

	var roundNumberHours;
	var market = "us";

	$scope.showForecastSector = false;
	$scope.showKeyOutputThree = false;
	$scope.customStartDate = last7Days;
	$scope.customEndDate = today;

	$scope.showRank = "show-rank";
	console.log("Today " + today + " | Yesterday: " + yesterday + " | Last Monday: " +  lastMonday + " | Last 7 days: "  + last7Days +  " | Last 14 days: " + last14Days + " | First day of current month: "  + firstDayOfCurrentMonth + " | Last 30 days: " + last30Days + " last week monday " + lastWeekMonday + " last week friday " + lastWeekFriday + " last week sunday " + lastWeekSunday + " first day last month " + firstDayOfLastMonth + " last day last month " + lastDayOfLastMonth);


	$scope.onDateRangeSelection = function() {
		if ($scope.queryDate.selected.call === "today") {
			startDate = today;
			endDate = today
		}

		else if ($scope.queryDate.selected.call === "yesterday"){
			startDate = yesterday;
			endDate = yesterday;
		}

		else if ($scope.queryDate.selected.call === "last-7-days") {
			startDate = last7Days;
			endDate = today;
		}

		//this one's buggy
		else if ($scope.queryDate.selected.call === "last-week") {
			startDate = lastWeekMonday;
			endDate = lastWeekSunday
		}

		else if ($scope.queryDate.selected.call === "last-working-week") {
			startDate = lastWeekMonday;
			endDate = lastWeekFriday;
		}

		else if ($scope.queryDate.selected.call === "last-14-days") {
			startDate = last14Days;
			endDate = today;
		}

		else if ($scope.queryDate.selected.call === "this-month") {
			startDate = firstDayOfCurrentMonth;
			endDate = today;
		}

		else if ($scope.queryDate.selected.call === "last-30-days") {
			startDate = last30Days;
			endDate = today;
		}

		else if ($scope.queryDate.selected.call === "last-month") {
			startDate = firstDayOfLastMonth;
			endDate = lastDayOfLastMonth;
		}

		else if ($scope.queryDate.selected.call === "all-time") {
			startDate = "01/01/15";
			endDate = today;
		}

		//else if ($scope.queryDate.selected.call === "custom") {
		//	startDate = $scope.customStartDate;
		//	endDate = $scope.customEndDate;
		//}
	};

	//market
	$scope.queryMarket = {};
	$scope.queryMarkets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	//assigning default value
	$scope.queryMarket.selected = $scope.queryMarkets[0];

	//basic query
	$scope.basicQuery = {};
	$scope.basicQueries = [
		{name: 'Market Rank', call: 'Community Rank', 'description': 'Market Rankis a hybrid calculation to determine overall rank within the community', 'selection': 'community-rank', 'title': 'Rank Score:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Correct Forecasts'},
		{name: 'User Performance Score', call: 'User Performance Index', 'description': 'User Performance Score is a calculation that determines your personal score relative to your forecast performance', 'selection': 'user-performance-score', 'title': 'Personal Performance Score:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Correct Forecasts'},
		{name: 'Most Successful Sector', call: 'Most Successful Sector', 'description': 'The Sector that you are the most accurate in.' , 'selection': 'most-successful-sector', 'title': 'Most Successfull Sector', 'outputTwoSelection': 'Total Forecasts in the Sector', 'outputThreeSelection': 'Correct Forecasts in Sector'},
		{name: 'Pick Position', call: 'Pick Position', 'description': 'The overall pick position is your average position relative to forecast uniqueness. When you make a unique forecast, its pick position is 1. This is your average', 'selection': 'pick-position', 'title': 'Pick Position Average:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Correct Forecasts'},
		{name: 'Pick Latency', call: 'Pick Latency', 'description': 'The average amount of time (in hours) available until your forecast is validated from its creation.', 'selection': 'pick-latency', 'title': 'Pick Latency:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Correct Forecasts'},
		{name: 'Total % correct overall', call: 'Total % correct overall', 'description': 'Your total correct percentage of all of your validated forecasts', 'selection': 'total-correct-overall', 'title':'% Correct Overall:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Correct Forecasts'},
		{name: 'Total % gained overall', call: 'Total % gained overall', 'description': 'The total percentage you have gained for all of your accurate forecasts', 'selection': 'total-gained-overall', 'title':'% Gained Overall:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Correct Forecasts'},

		{name: '% Correct in Utilities', call: '% correct in Utilities', 'description': 'Your percentage correct of all forecasts you have made in the Utilities sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Utilities:', 'outputTwoSelection': 'Total Forecasts in Utilities', 'outputThreeSelection': 'Correct Forecasts in Utilities'},
		{name: '% Correct in Services', call: '% correct in Services', 'description': 'Your percentage correct of all forecasts you have made in the Services sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Services:', 'outputTwoSelection': 'Total Forecasts in Services: ', 'outputThreeSelection': 'Correct Forecasts in Services'},
		{name: '% Correct in Industrial Goods', call: '% correct in industrial goods', 'description': 'Your percentage correct of all forecasts you have made in the Industrial Goods sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Industrial Goods:', 'outputTwoSelection': 'Total Forecasts in Industrial Goods', 'outputThreeSelection': 'Correct Forecasts in Industrial Goods'},
		{name: '% Correct in Consumer Goods', call: '% correct in consumer goods', 'description': 'Your percentage correct of all forecasts you have made in the Consumer Goods sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Consumer Goods:', 'outputTwoSelection': 'Total Forecasts in Consumer Goods', 'outputThreeSelection': 'Correct Forecasts in Consumer Goods'},
		{name: '% Correct in Conglomerates', call: '% correct in conglomerates', 'description': 'Your percentage correct of all forecasts you have made in the Conglomerates sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Conglomerates:', 'outputTwoSelection': 'Total Forecasts in Conglomerates', 'outputThreeSelection': 'Correct Forecasts in Conglomerates'},
		{name: '% Correct in Financial', call: '% correct in financial', 'description': 'Your percentage correct of all forecasts you have made in the Financial sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Financial:', 'outputTwoSelection': 'Total Forecasts in Financial', 'outputThreeSelection': 'Correct Forecasts in Financial'},
		{name: '% Correct in Healthcare', call: '% correct in healthcare', 'description': 'Your percentage correct of all forecasts you have made in the Healthcare sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Healthcare:', 'outputTwoSelection': 'Total Forecasts in Healthcare: ', 'outputThreeSelection': 'Correct Forecasts in Healthcare'},
		{name: '% Correct in Basic Materials', call: '% correct in basic materials', 'description': 'Your percentage correct of all forecasts you have made in the Basic Materials sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Basic Materials:', 'outputTwoSelection': 'Total Forecasts in Materials', 'outputThreeSelection': 'Correct Forecasts in Materials'},
		{name: '% Correct in Technology', call: '% correct in technology', 'description': 'Your percentage correct of all forecasts you have made in the Technology sector', 'selection': '%-correct-in-sector', 'title':'% Correct in Technology:', 'outputTwoSelection': 'Total Forecasts in Technology', 'outputThreeSelection': 'Correct Forecasts in Technology'},

		{name: '% Correct in Mega Cap', call: '% correct in mega cap', 'description': 'Your percentage correct of all forecasts you have made in the Mega cap', 'selection': '%-correct-in-cap', 'title':'% Correct in Mega Cap:', 'outputTwoSelection': 'Total Forecasts in Mega Cap', 'outputThreeSelection': 'Correct Forecasts in Mega Cap'},
		{name: '% Correct in Large Cap', call: '% correct in large cap', 'description': 'Your percentage correct of all forecasts you have made in the Large cap', 'selection': '%-correct-in-cap', 'title':'% Correct in Large Cap:', 'outputTwoSelection': 'Total Forecasts in Large Cap', 'outputThreeSelection': 'Correct Forecasts in Large Cap'},
		{name: '% Correct in Mid cap', call: '% correct in mid cap', 'description': 'Your percentage correct of all forecasts you have made in the Mid cap', 'selection': '%-correct-in-cap', 'title':'% Correct in Mid Cap:', 'outputTwoSelection': 'Total Forecasts in Mid Cap', 'outputThreeSelection': 'Correct Forecasts in Mid Cap'},
		{name: '% Correct in Small cap', call: '% correct in micro cap', 'description': 'Your percentage correct of all forecasts you have made in the Small cap', 'selection': '%-correct-in-cap', 'title':'% Correct in Small Cap:', 'outputTwoSelection': 'Total Forecasts in Small Cap', 'outputThreeSelection': 'Correct Forecasts in Small Cap'},
		{name: '% Correct in Micro cap', call: '% correct in micro cap', 'description': 'Your percentage correct of all forecasts you have made in the Micro cap', 'selection': '%-correct-in-cap', 'title':'% Correct in Micro Cap:', 'outputTwoSelection': 'Total Forecasts in Micro Cap', 'outputThreeSelection': 'Correct Forecasts in Micro Cap'},
		{name: '% Correct in Nano cap', call: '% correct in nano cap', 'description': 'Your percentage correct of all forecasts you have made in the Nano cap', 'selection': '%-correct-in-cap', 'title':'% Correct in Nano Cap:', 'outputTwoSelection': 'Total Forecasts in Nano Cap', 'outputThreeSelection': 'Correct Forecasts in Nano'},

		{name: '% Gained in Utilities', call: '% gained in Utilities', 'description': 'The total percentage you have gained of all correct forecasts made in the Utilities sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Utilities:', 'outputTwoSelection': 'Total Forecasts in Utilities', 'outputThreeSelection': 'Correct Forecasts in Utilities'},
		{name: '% Gained in Services', call: '% gained in Services', 'description': 'The total percentage you have gained of all correct forecasts made in the Services sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Services:', 'outputTwoSelection': 'Total Forecasts in Services', 'outputThreeSelection': 'Correct Forecasts in Services'},
		{name: '% Gained in Industrial Goods', call: '% gained in industrial goods', 'description': 'The total percentage you have gained of all correct forecasts made in the Industrial Goods sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Industrial Goods:',  'outputTwoSelection': 'Total Forecasts in Industrial Goods', 'outputThreeSelection': 'Correct Forecasts in Industrial Goods'},
		{name: '% Gained in Consumer Goods', call: '% gained in consumer goods','description': 'The total percentage you have gained of all correct forecasts made in the Consumer Goods sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Consumer Goods:', 'outputTwoSelection': 'Total Forecasts in Consumer Goods', 'outputThreeSelection': 'Correct Forecasts in Consumer Goods'},
		{name: '% Gained in Conglomerates', call: '% gained in conglomerates','description': 'The total percentage you have gained of all correct forecasts made in the Conglomerates sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Conglomerates:',  'outputTwoSelection': 'Total Forecasts in Conglomerates', 'outputThreeSelection': 'Correct Forecasts in Conglomerates'},
		{name: '% Gained in Financial', call: '% gained in financial', 'description': 'The total percentage you have gained of all correct forecasts made in the Financial sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Financial:',  'outputTwoSelection': 'Total Forecasts in Financial', 'outputThreeSelection': 'Correct Forecasts in Financial'},
		{name: '% Gained in Healthcare', call: '% gained in healthcare', 'description': 'The total percentage you have gained of all correct forecasts made in the Healthcare sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Healthcare:',  'outputTwoSelection': 'Total Forecasts in Healthcare: ', 'outputThreeSelection': 'Correct Forecasts in Healthcare'},
		{name: '% Gained in Basic Materials', call: '% gained in basic materials', 'description': 'The total percentage you have gained of all correct forecasts made in the Basic Materials sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Basic Materials:', 'outputTwoSelection': 'Total Forecasts in Materials', 'outputThreeSelection': 'Correct Forecasts in Materials'},
		{name: '% Gained in Technology', call: '% gained in technology', 'description': 'The total percentage you have gained of all correct forecasts made in the Technology sector', 'selection': '%-gained-in-sector', 'title':'% Gained in Technology:', 'outputTwoSelection': 'Total Forecasts in Technology', 'outputThreeSelection': 'Correct Forecasts in Technology'},

		{name: '% Gained in Mega cap', call: '% gained in mega cap', 'description': 'The total percentage you have gained of all correct forecasts made in the Mega cap', 'selection': '%-gained-in-cap', 'title':'% Gained in Mega Cap:', 'outputTwoSelection': 'Total Forecasts in Mega Cap', 'outputThreeSelection': 'Correct Forecasts in Mega Cap'},
		{name: '% Gained in Large cap', call: '% gained in large cap', 'description': 'The total percentage you have gained of all correct forecasts made in the Large cap', 'selection': '%-gained-in-cap', 'title':'% Gained in Large Cap:', 'outputTwoSelection': 'Total Forecasts in Large Cap', 'outputThreeSelection': 'Correct Forecasts in Large Cap'},
		{name: '% Gained in Mid cap', call: '% gained in mid cap', 'description': 'The total percentage you have gained of all correct forecasts made in the Mid cap', 'selection': '%-gained-in-cap', 'title':'% Gained in Mid Cap:', 'outputTwoSelection': 'Total Forecasts in Mid Cap', 'outputThreeSelection': 'Correct Forecasts in Mid Cap'},
		{name: '% Gained in Small cap', call: '% gained in micro cap', 'description': 'The total percentage you have gained of all correct forecasts made in the Small cap', 'selection': '%-gained-in-cap', 'title':'% Gained in Small Cap:', 'outputTwoSelection': 'Total Forecasts in Small Cap', 'outputThreeSelection': 'Correct Forecasts in Small Cap'},
		{name: '% Gained in Micro cap', call: '% gained in micro cap', 'description': 'The total percentage you have gained of all correct forecasts made in the Micro cap', 'selection': '%-gained-in-cap', 'title':'% Gained in Micro Cap:', 'outputTwoSelection': 'Total Forecasts in Micro Cap', 'outputThreeSelection': 'Correct Forecasts in Micro Cap'},
		{name: '% Gained in Nano cap', call: '% gained in nano cap', 'description': 'The total percentage you have gained of all correct forecasts made in the Nano cap', 'selection': '%-gained-in-cap', 'title':'% Gained in Nano Cap:', 'outputTwoSelection': 'Total Forecasts in Nano Cap', 'outputThreeSelection': 'Correct Forecasts in Nano Cap'},

		{name: '% Mega cap chosen', call: '% mega cap chosen', 'description': 'The total percentage of forecasts you have made in the Mega cap', 'selection': '%-cap-chosen', 'title':'% Mega Cap Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Mega Cap'},
		{name: '% Large cap chosen', call: '% large cap chosen', 'description': 'The total percentage of forecasts you have made in the Large cap', 'selection': '%-cap-chosen', 'title':'% Large Cap Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Large Cap'},
		{name: '% Mid cap chosen', call: '% mid cap chosen', 'description': 'The total percentage of forecasts you have made in the Mid cap', 'selection': '%-cap-chosen', 'title':'% Mid Cap Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Mid Cap'},
		{name: '% Small cap chosen', call: '% micro cap chosen', 'description': 'The total percentage of forecasts you have made in the Small cap', 'selection': '%-cap-chosen', 'title':'% Small Cap Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Small Cap'},
		{name: '% Micro cap chosen', call: '% micro cap chosen', 'description': 'The total percentage of forecasts you have made in the Micro cap', 'selection': '%-cap-chosen', 'title':'% Micro Cap Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Micro Cap'},
		{name: '% Nano cap chosen', call: '% nano cap chosen', 'description': 'The total percentage of forecasts you have made in the Nano cap', 'selection': '%-cap-chosen', 'title':'% Nano Cap Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Nano Cap'},

		{name: '% Utilities chosen', call: '% Utilities chosen', 'description': 'The total percentage of forecasts you have made in the Utilities sector', 'selection': '%-sector-chosen', 'title':'% Utilities Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Utilities'},
		{name: '% Services chosen', call: '% Services chosen', 'description': 'The total percentage of forecasts you have made in the Services sector', 'selection': '%-sector-chosen', 'title':'% Services Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Services'},
		{name: '% Industrial Goods chosen', call: '% industrial goods chosen', 'description': 'The total percentage of forecasts you have made in the Industrial Goods sector', 'selection': '%-sector-chosen', 'title':'% Industrial Gods Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Industrial Goods'},
		{name: '% Consumer Goods chosen', call: '% consumer goods chosen', 'description': 'The total percentage of forecasts you have made in the Consumer Goods sector', 'selection': '%-sector-chosen', 'title':'% Consumer Goods Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Consumer Goods'},
		{name: '% Conglomerates chosen', call: '% conglomerates chosen', 'description': 'The total percentage of forecasts you have made in the Conglomerates sector', 'selection': '%-sector-chosen', 'title':'% Conglomerates Chosen:', 'outputTwoSelection': 'Total Forecasts:', 'outputThreeSelection': 'Forecasts in Conglomerates'},
		{name: '% Financial chosen', call: '% financial chosen', 'description': 'The total percentage of forecasts you have made in the Financial sector', 'selection': '%-sector-chosen', 'title':'% Financial Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Financial'},
		{name: '% Healthcare chosen', call: '% healthcare chosen', 'description': 'The total percentage of forecasts you have made in the Healthcare sector', 'selection': '%-sector-chosen', 'title':'% Healthcare Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Healthcare'},
		{name: '% Basic Materials chosen', call: '% basic materials chosen', 'description': 'The total percentage of forecasts you have made in the Basic Materials sector', 'selection': '%-sector-chosen', 'title':'% Basic Materials Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Basic Materials'},
		{name: '% Technology chosen', call: '% technology chosen', 'description': 'The total percentage of forecasts you have made in the Technology sector', 'selection': '%-sector-chosen', 'title':'% Technologies Chosen:', 'outputTwoSelection': 'Total Forecasts', 'outputThreeSelection': 'Forecasts in Technologies'}
	];

	//assigning default value
	$scope.basicQuery.selected = $scope.basicQueries[0];

	$scope.keyMain = "Rank Score";
	$scope.keyOutputTwo = "Total Forecasts";
	$scope.keyOutputThree = "Correct Forecasts";

	$scope.nameKeys = function() {
		$scope.keyMain = $scope.basicQuery.selected.title;
		$scope.keyOutputTwo = $scope.basicQuery.selected.outputTwoSelection;
		$scope.keyOutputThree = $scope.basicQuery.selected.outputThreeSelection;

		if ($scope.basicQuery.selected.selection === "most-successful-sector") {
			$scope.showForecastSector = true;
		}

		else {
			$scope.showForecastSector = false;
		}



		if ($scope.basicQuery.selected.selection == "community-rank" || $scope.basicQuery.selected.selection == "pick-position" || $scope.basicQuery.selected.selection == "pick-latency") {
			$scope.showKeyOutputThree = false;
		}

		else {
			$scope.showKeyOutputThree = true;
		}



		if ($scope.basicQuery.selected.selection == "community-rank") {
			$scope.showRank = "show-rank";
		}

		else if ($scope.basicQuery.selected.selection == "most-successful-sector" || $scope.basicQuery.selected.selection == "pick-latency") {
			$scope.showRank = "hide-everything";
		}

		else {
			$scope.showRank = "show-query";
			if ($scope.basicQuery.selected.selection == "user-performance-score") {
				$scope.indexKey = "User Performance Score";
			}

			else if ($scope.basicQuery.selected.selection == "total-correct-overall") {
				$scope.indexKey = "Total Correct Overall";
			}

			else if ($scope.basicQuery.selected.selection == "total-gained-overall") {
				$scope.indexKey = "Total Gained Overall";
			}

			else if ($scope.basicQuery.selected.selection == "%-correct-in-sector") {
				$scope.indexKey = "% Correct in the selected sector";
			}

			else if ($scope.basicQuery.selected.selection == "%-correct-in-cap") {
				$scope.indexKey = "% Correct in the selected cap";
			}

			else if ($scope.basicQuery.selected.selection == "%-gained-in-sector") {
				$scope.indexKey = "% Gained in the selected sector";
			}

			else if ($scope.basicQuery.selected.selection == "%-gained-in-cap") {
				$scope.indexKey = "% Gained in the selected cap";
			}

			else if ($scope.basicQuery.selected.selection == "%-cap-chosen") {
				$scope.indexKey = "% Selected cap chosen";
			}

			else if ($scope.basicQuery.selected.selection == "%-sector-chosen") {
				$scope.indexKey = "% Selected sector chosen";
			}

			else {
				$scope.indexKey = "Not specified";
			}
		}




		if ($scope.basicQuery.selected.selection == "community-rank" || $scope.basicQuery.selected.selection == "user-performance-score" || $scope.basicQuery.selected.selection == "pick-position" || $scope.basicQuery.selected.selection == "pick-latency" || $scope.basicQuery.selected.selection == "total-correct-overall" || $scope.basicQuery.selected.selection == "total-gained-overall" || $scope.basicQuery.selected.selection == "%-correct-in-sector" || $scope.basicQuery.selected.selection == "%-correct-in-cap" || $scope.basicQuery.selected.selection == "%-gained-in-sector" || $scope.basicQuery.selected.selection == "%-gained-in-cap" || $scope.basicQuery.selected.selection == "%-sector-chosen" || $scope.basicQuery.selected.selection == "%-cap-chosen" ) {
			roundNumber = true;

			if ($scope.basicQuery.selected.selection == "community-rank" || $scope.basicQuery.selected.selection == "user-performance-score" || $scope.basicQuery.selected.selection == "pick-position") {
				roundNumberOnly = true;
				roundNumberHours = false;
			}

			else if ($scope.basicQuery.selected.selection == "pick-latency") {
				roundNumberHours = true;
				roundNumberOnly = false;
			}

			else {
				roundNumberHours = false;
				roundNumberOnly = false;
			}
		}

		else {
			console.log("false");
			roundNumber = false;
		}

	};

	$scope.getHoveredObject = function(query) {
		$scope.selectedItem = query;
		selectedToFollow = $scope.selectedItem.user;
		console.log(selectedToFollow);
		$scope.getAtGlance();
		$scope.getUserFollowingInfo();
	};

	$scope.getUserFollowingInfo = function () {
		API.getHttp("/personal/ifollow/" + currentUsername + "/" + selectedToFollow, {
					ignoreLoadingBar: true
				})

				.then(function (data) {
					$scope.followingData = data;
					if ($scope.followingData == "yes") {
						$scope.followButton = "Unfollow";
					}

					else {
						$scope.followButton = "Follow";
					}
				},function(){
					console.log("Not following");
				});
	};

	$scope.getAtGlance = function () {
		API.getHttp("/personal/profile/" + "us" + "/" + selectedToFollow, {
					ignoreLoadingBar: true
				})

				.then(function (data) {
					$scope.atGlanceData = data;
					console.log("user info got");
				},function(){
					console.log("user info haven't been got");
				});
	};

	$scope.followUser = function () {
		var followUnfollowLink;

		if ($scope.followingData == "no") {
			followUnfollowLink = "/personal/follow/add";
			$scope.followButton = "Unfollow";
		}

		else {
			followUnfollowLink = "/personal/follow/remove";
			$scope.followButton = "Follow";
		}
		console.log('>',followUnfollowLink);
		API.postHttp(followUnfollowLink,{
				"user": currentUsername,
				"member": selectedToFollow
			}
		).then(function(data){
			console.log(data);
		},function(e){
			console.error(e);
		});

	};

	//basic query dates
	$scope.queryDate = {};
	$scope.queryDates = [
		{name: 'Today', call: 'today'},
		{name: 'Yesterday', call: 'yesterday'},
		{name: 'Last 7 Days', call: 'last-7-days'},
		//{name: 'Last Week (Mon - Sun)', call: 'last-week'},
		//{name: 'Last Working Week (Mon - Fri)', call: 'last-working-week'},
		{name: 'Last 14 Days', call: 'last-14-days'},
		//{name: 'This Month', call: 'this-month'},
		{name: 'Last 30 Days', call: 'last-30-days'},
		{name: 'Last Month', call: 'last-month'},
		{name: 'All Time', call: 'all-time'},
		{name: 'Custom', call: 'custom'}
	];
	//assigning default value
	$scope.queryDate.selected = $scope.queryDates[2];


	$scope.getQueries = function () {
		API.postHttp('/personal/query/tla',{
				"StartDate" : last7Days,
				"EndDate": today,
				"TLA" : "Community Rank",
				"Market" : "US"
			}).then(function(data){
					$scope.isBasicQuery = true;
					console.log(data);
					$scope.queryData = data.Results;
					$scope.queryData = setAvatarToQueryData($scope.queryData);
					console.log($scope.queryData)
				},function(){
					console.log("initial basic query unsuccessfull " + today + " " + last7Days);

				});
	};

	$scope.getQueries(); //calling the intial default basic queries

	function setAvatarToQueryData(data){
		return _.map(data,function(item){
			API.getHttp('/personal/avatar/'+item.user).then(function(avatar){
				item.avatar = avatar.avatar;
			})
			return item;
		})
	}
	$scope.getUpdatedQueries = function () {
		//hack for getting custom date work
		if ($scope.queryDate.selected.call === "custom") {
			startDate = $scope.customStartDate;
			endDate = $scope.customEndDate;
		}
		API.postHttp('/personal/query/tla',
			{
				"StartDate" : startDate,
				"EndDate": endDate,
				"TLA" : $scope.basicQuery.selected.call,
				"Market" : $scope.queryMarket.selected.symbol
			}
		).then(function(data){
			$scope.isBasicQuery = true;
			console.log(data);
			$scope.queryData = data.Results;
			$scope.queryData = setAvatarToQueryData($scope.queryData);
			$scope.nameKeys();


			console.log($scope.queryMarket.selected.symbol);
		},function(){
			console.log("Updated Query Unsuccessfull " + startDate + " " + endDate + " " +  $scope.basicQuery.selected.call + " " +  $scope.queryMarket.selected.symbol);
		});
	};

	$scope.formatNumber = function(i) {

		if (roundNumber == true) {

			if (roundNumberOnly == true) {
				return i.toFixed(1);
			}

			else if (roundNumberHours == true) {
				return i.toFixed(1) + " hours";
			}

			else {
				return i.toFixed(1) + "%";
			}
		}


		else {
			return i.toFixed(0);
		}
	};

	/*
		Custom Queries Start
		---------------------------------------
	 */

	$scope.customQuery = {};

	$scope.customQuery.types = [
		{"name": "Market Rank","call": "community rank",  "description": "Desc"},
		{"name": "User Performance Score", "call": "user performance index", "description": "Desc"},
		{"name": "%Correct", "call": "%correct", "description": "Desc"},
		{"name": "%Gained",  "call": "%gained", "description": "Desc"},
		{"name": "%Chosen", "call": "%chosen", "description": "Desc"},
		{"name": "Pick Latency", "call": "pick latency", "description": "Desc"},
		{"name": "Pick Position", "call": "pick position", "description": "Desc"}
	];

	$scope.customQuery.type = [];
	$scope.customQuery.type.selected = $scope.customQuery.types[0];

	$scope.nameCustomQueryKeys = function() {
		if ($scope.customQuery.type.selected.call == "pick latency") {
			$scope.customQuery.resultvalOutput = "Latency";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.positionOutput = "Market Rank";
			$scope.customQuery.sufix = " hours";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = false;
		}

		else if ($scope.customQuery.type.selected.call == "user performance index") {
			$scope.customQuery.resultvalOutput = "Performance Score";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.numberOfPicksOutput = "Correct Forecasts";
			$scope.customQuery.sufix = "";
			$scope.customQuery.positionOutput = "User Performance Score";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = true;
		}

		else if ($scope.customQuery.type.selected.call == "community rank") {
			$scope.customQuery.resultvalOutput = "Rank Score";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.numberOfPicksOutput = "Correct Forecasts";
			$scope.customQuery.sufix = "";
			$scope.customQuery.positionOutput = "Market Rank";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = true;
		}

		else if ($scope.customQuery.type.selected.call == "pick position") {
			$scope.customQuery.resultvalOutput = "Pick Position Average";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.numberOfPicksOutput = "Correct Forecasts";
			$scope.customQuery.sufix = "";
			$scope.customQuery.positionOutput = "false";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = false;
		}

		else if ($scope.customQuery.type.selected.call == "%chosen") {
			$scope.customQuery.resultvalOutput = "% Forecasts That Match";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.numberOfPicksOutput = "Forecasts That Match";
			$scope.customQuery.sufix = "%";
			$scope.customQuery.positionOutput = "Total Chosen Overall";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = true;
		}

		else if ($scope.customQuery.type.selected.call == "%correct") {
			$scope.customQuery.resultvalOutput = "% Correct";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.numberOfPicksOutput = "Correct Forecasts";
			$scope.customQuery.sufix = "%";
			$scope.customQuery.positionOutput = "Total Correct Overall";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = true;
		}

		else if ($scope.customQuery.type.selected.call == "%gained") {
			$scope.customQuery.resultvalOutput = "% Gained";
			$scope.customQuery.allPicksOutput = "Total Forecasts";
			$scope.customQuery.numberOfPicksOutput = "Correct Forecasts";
			$scope.customQuery.sufix = "%";
			$scope.customQuery.positionOutput = "Total Gained Overall";
			$scope.showAllPicks = true;
			$scope.showResultVal = true;
			$scope.showNumberOfPicks = true;
		}
	};

	$scope.customQuery.time = [];
	$scope.customQuery.times = ["morning", "midday", "close"];

	$scope.customQuery.sector = [];
	$scope.customQuery.sectors = ["utilities", "services", "industrial goods", "consumer goods", "conglomerates", "financial", "healthcare", "basic materials", "technology"];

	$scope.customQuery.movement = [];
	$scope.customQuery.movements = ["up", "down", "all"];
	$scope.customQuery.movement.selected = $scope.customQuery.movements[2];

	$scope.customQuery.marketCapitalization = [];
	$scope.customQuery.marketCapitalizations =  ["mega", "large", "mid", "small", "micro", "nano"];

	$scope.customQuery.symbol = [];


	var customQuerySector;
	var customQueryTime;
	var customQueryMarketCapitalization;
	var customQuerySymbol;
	$scope.checkDefaults = function () {
		if ($scope.customQuery.time.length == 0 ) {
			customQueryTime = $scope.customQuery.times;
		}

		else {
			customQueryTime = $scope.customQuery.time;
		}


		if ($scope.customQuery.sector.length == 0) {
			customQuerySector = $scope.customQuery.sectors;
		}

		else {
			customQuerySector = $scope.customQuery.sector;
		}


		if ($scope.customQuery.marketCapitalization.length == 0) {
			customQueryMarketCapitalization = $scope.customQuery.marketCapitalizations;
		}

		else {
			customQueryMarketCapitalization = $scope.customQuery.marketCapitalization;
		}


		if ($scope.customQuery.symbol.length == 0) {
			customQuerySymbol = "all";
			console.log($scope.customQuery.symbol.length);
		}

		else {
			customQuerySymbol = $scope.customQuery.symbol;
		}

	};

	$scope.getCustomQueries = function () {
		$scope.getDefaultSymbolList();

		API.postHttp('/personal/query/bla',
				 [{
						"PerformanceVariable": "Community Rank",
						"StartDate": last7Days,
						"EndDate": today,
						"Community":"all",
						"IsGroup":"false",
						"Symbol":"all",
						"MCapCategory":"all",
						"Sector":"all",
						"Movement":"all",
						"TimeOfDay":"all",
						"Market":"US"

					}]
		).then(function(data){
					$scope.isBasicQuery = false;
					$scope.nameCustomQueryKeys();
					console.log(data);
					$scope.customQueryData = setAvatarToQueryData(data[0].Results);

					console.log($scope.customQueryData)
				},function(){
					console.log("initial custom query unsuccessfull");

				});
	};

	$scope.getUpdatedCustomQueries = function () {
		$scope.checkDefaults();
		$scope.onCommunitySelection();
		//update community value

		//hack to make custom date working
		if ($scope.queryDate.selected.call === "custom") {
			startDate = $scope.customStartDate;
			endDate = $scope.customEndDate;
		}
		API.postHttp('/personal/query/bla',
			[{
				"PerformanceVariable": $scope.customQuery.type.selected.call,
				"StartDate" : startDate,
				"EndDate": endDate,
				"Community": customQueryCommunity,
				"IsGroup": isGroup,
				"Symbol": customQuerySymbol,
				"MCapCategory": customQueryMarketCapitalization,
				"Sector": customQuerySector,
				"Movement": $scope.customQuery.movement.selected,
				"TimeOfDay": customQueryTime,
				"Market": $scope.queryMarket.selected.symbol
			}]
		).then(function(data){
				$scope.nameCustomQueryKeys();
				$scope.isBasicQuery = false;
				console.log(data);
				$scope.customQueryData = setAvatarToQueryData(data[0].Results);
				console.log($scope.customQueryData)
			},function(){
				console.log("initial custom query unsuccessfull " + $scope.customQuery.type);
			});
	};

	$scope.liveSearchSymbol = function() {
		market = $scope.queryMarket.selected.symbol;
		API.getHttp("/personal/getsymbols/" + market)
			.then(function (data) {
				$scope.selected = undefined;
				$scope.symbols = data;
				console.log($scope.symbols);
			},function(){
				console.log("Live search symbol API error");
			});
	};

	$scope.getDefaultSymbolList = function () {
		API.getHttp("/personal/getsymbols/us")
			.then(function (data) {
				$scope.selected = undefined;
				$scope.symbols = data;
				console.log($scope.symbols);
			},function(){
				console.log("Live search symbol API error");
			});
	};

	//initialized user group
	$scope.forecastUserGroupResult = {};
	$scope.getCustomQueryUserGroups = function(apiCallLink) {
		API.postHttp(apiCallLink,{
				"owner": currentUsername
			}).then(function(data){
					console.log(data);
					$scope.customQueryGroups = data;
				},function(){
					alert("getUserResultsPost Unsuccessfull");
				});
	};

	$scope.customQuery.user = [];
	$scope.getUsers = function() {
		API.getHttp("/personal/return/users")
			.then(function (data) {
				$scope.customQuery.users = data;

			},function(){
				console.log("Live search symbol API error");
			});
	};

	//$scope.customQuery.group = [];
	var customQueryCommunity;
	var isGroup = "false";
	$scope.customQuery.communities = ["Users", "Groups"];
	$scope.onCommunitySelection = function () {

		if ($scope.customQuery.community == "Users") {
			$scope.showUsers = true;
			$scope.showGroups = false;
			isGroup = "false";
			$scope.getUsers();
			//doesn't work as a default, neds fix
			customQueryCommunity = $scope.customQuery.user;

		}

		else if ($scope.customQuery.community == "Groups") {
			$scope.showUsers = false;
			$scope.showGroups = true;
			isGroup = "true";
			$scope.getCustomQueryUserGroups("/personal/group/find");
			//doesn't work as a default, neds fix
			customQueryCommunity = $scope.customQuery.group.name;
		}

		else {
			isGroup = "false";
			customQueryCommunity = "all";
		}
	};

	$scope.getGroups = function() {

	}

	$scope.formatNumberAlways = function(i) {
		return i.toFixed(1);
	}
}]);