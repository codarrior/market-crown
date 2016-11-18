var newUsername;
var dashDate = {};
var dateRange = {};
dashDate.today = Date.parse('today').toString('MM-dd-yy');
dashDate.yesterday = Date.parse('yesterday').toString('MM-dd-yy');
dashDate.lastMonday = Date.parse('last monday').toString('MM-dd-yy');
dashDate.lastWeekMonday = Date.monday().addDays(-7).toString('MM-dd-yy');
dashDate.lastWeekFriday = Date.friday().addDays(-7).toString('MM-dd-yy');
dashDate.lastWeekSunday = Date.sunday().addDays(-7).toString('MM-dd-yy');
dashDate.last7Days = Date.today().addDays(-7).toString('MM-dd-yy');
dashDate.last14Days =  Date.today().addDays(-14).toString('MM-dd-yy');
dashDate.last30Days =  Date.today().addDays(-30).toString('MM-dd-yy');
dashDate.firstDayOfCurrentMonth = Date.today().moveToFirstDayOfMonth().toString('MM-dd-yy');
dashDate.firstDayOfLastMonth = Date.parse('- 1months').moveToFirstDayOfMonth().toString('MM-dd-yy');
dashDate.lastDayOfLastMonth = Date.parse('- 1months').moveToLastDayOfMonth().toString('MM-dd-yy');

App.controller ('UserCtrl', function ($scope, $http, $location, $q, UserChartsService, UserDetailsService, ForecastService, GeneralDataService, APIService){
	console.log('currentUser',$scope.currentUser);
	var currentUsername = $scope.currentUser.user || $scope.currentUser.mc_username;

		var logginedUser = UserDetailsService.getUser().mc_username;


	$scope.isMyProfile = String(logginedUser).toLowerCase() == String(currentUsername).toLowerCase();
	$scope.currentUsername=currentUsername;
	console.log('currentUser',currentUsername);
	var market = "us";
	//pie chart options
	$scope.options = {
		chart: {
			type: 'pieChart',
			height: 300,
			x: function(d){return d.key;},
			y: function(d){return d.y;},
			showLabels: false,
			duration: 350,
			transitionDuration: 1000,
			labelThreshold: 0.01,
			labelSunbeamLayout: true,
			legend: {
				margin: {
					top: 5,
					right: 35,
					bottom: 0,
					left: 0
				}
			}
		}
	};
	$scope.profileStats = {};
	$scope.username = {};
	$scope.profileStats.chart = {};
	$scope.group = {};

	$scope.multiselect = {};
	$scope.multiselect.users = [];

	//line chart options
	$scope.lineOptions = {
		chart: {
			type: 'lineChart',
			height: 300,
			margin : {
				top: 20,
				right: 20,
				bottom: 40,
				left: 55
			},
			x: function(d){ return d.x; },
			y: function(d){ return d.y; },
			useInteractiveGuideline: true,
			dispatch: {
				stateChange: function(e){ console.log("stateChange"); },
				changeState: function(e){ console.log("changeState"); },
				tooltipShow: function(e){ console.log("tooltipShow"); },
				tooltipHide: function(e){ console.log("tooltipHide"); }
			},
			xAxis: {
				axisLabel: 'Dates',
				tickFormat: function(d) {
					// return d3.time.format('%x')(new Date(new Date() - (20000 * 86400000) + (d * 86400000)));
					return d3.time.format('%x')(new Date(d*1000));
				},
				showMaxMin: false
			},
			yAxis: {
				axisLabel: 'Score',
				tickFormat: function(d){
					return d3.format('.02f')(d);
				},
				axisLabelDistance: -10
			},
			callback: function(chart){
				console.log("!!! lineChart callback !!!");
			}
		},
		title: {
			enable: false,
			text: 'Title for Line Chart'
		},
		subtitle: {
			enable: false,
			text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
			css: {
				'text-align': 'center',
				'margin': '10px 13px 0px 7px'
			}
		},
		caption: {
			enable: false,
			css: {
				'text-align': 'justify',
				'margin': '10px 13px 0px 7px'
			}
		}
	};

	$scope.lineData = userCompareChart();
	/*User Compare Chart */
	function userCompareChart(data) {
		var colors = ['#ff7f0e', '#2ca02c', '#7777ff'];
		var user_data = [];
		var ret_val = [];
		var i = 0;
		angular.forEach(data, function(value, key){
			user_data = [];
			angular.forEach(value, function(userValue){
				user_data.push({'x': userValue.date, 'y':userValue.result});
			});
			ret_val.push({
				values : user_data,
				key: key,
				color: colors[i],
				strokeWidth: 2,
				classed: 'dashed',
				area: true
			});
			i ++;
		});
		return ret_val;
	};



	//market selection
	$scope.profileStats.market = {};
	$scope.profileStats.markets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	$scope.profileStats.market.selected = $scope.profileStats.markets[0];
	$scope.profileStats.date = {};
	$scope.profileStats.dates = [
		{name: 'Today', call: 'today'},
		{name: 'Yesterday', call: 'yesterday'},
		{name: 'Last 7 Days', call: 'last-7-days'},
 		{name: 'Last 14 Days', call: 'last-14-days'},
		{name: 'Last 30 Days', call: 'last-30-days'},
		{name: 'Last Month', call: 'last-month'},
		{name: 'All Time', call: 'all-time'},
		{name: 'Custom', call: 'custom'}
	];

	//default selected date is "All"
	$scope.profileStats.date.selected = $scope.profileStats.dates[6];
	$scope.options.barChart = {
		chart: {
			type: 'discreteBarChart',
			height: 300,
			margin : {
				top: 20,
				right: 20,
				bottom: 50,
				left: 55
			},

			x: function(d){return d.label;},
			y: function(d){return d.value;},
			showValues: true,
			//valueFormat: function(d){
			//	return d3.format(',.4f')(d);
			//},

			valueFormat: function(d){
				return d.toFixed(0);
			},
			duration: 500
		}
	};
	$scope.profileStats.chart.sectorPreference = [];
	$scope.profileStats.dateSelection = function () {
		if ($scope.profileStats.date.selected.call === "today") {
			dateRange.start = dashDate.today;
			dateRange.end = dashDate.today
		}

		else if ($scope.profileStats.date.selected.call === "yesterday"){
			dateRange.start = dashDate.yesterday;
			dateRange.end = dashDate.yesterday;
		}

		else if ($scope.profileStats.date.selected.call === "last-7-days") {
			dateRange.start = dashDate.last7Days;
			dateRange.end = dashDate.today;
		}

		else if ($scope.profileStats.date.selected.call === "last-14-days") {
			dateRange.start = dashDate.last14Days;
			dateRange.end = dashDate.today;
		}

		else if ($scope.profileStats.date.selected.call === "last-30-days") {
			dateRange.start = dashDate.last30Days;
			dateRange.end = dashDate.today;
		}

		else if ($scope.profileStats.date.selected.call === "last-month") {
			dateRange.start = dashDate.firstDayOfLastMonth;
			dateRange.end = dashDate.lastDayOfLastMonth;
		}

		else if ($scope.profileStats.date.selected.call === "all-time") {
			dateRange.start = "01-01-14";
			dateRange.end ="01-01-20";
		}

		console.log(dateRange.start + " " + dateRange.end)
	};

	$scope.profileStats.customDateStart = "01-01-14";
	$scope.profileStats.customDateEnd = dashDate.today;

	var ifCustomDate = function() {
		if ($scope.profileStats.date.selected.call === "custom") {
			dateRange.start = $scope.profileStats.customDateStart;
			dateRange.end = $scope.profileStats.customDateEnd;
			console.log(dateRange.start);
		}
	};

	//default forecast status
	$scope.profileStats.forecastStatus = "";

	//controlling clicked items
	$scope.getClickedObject = function(clickedForecast) {
		$scope.selectedItem = clickedForecast;
		clickedUser = $scope.selectedItem.user;
		$scope.getAnalysis();
	};

	$scope.getAnalysis = function () {
		APIService.getHttp("/personal/find/analysis/" + $scope.selectedItem.guid, {
					ignoreLoadingBar: true
				})
				.then(function (data) {
					$scope.forecastAnalysis = data;
					console.log($scope.forecastAnalysis);
					if ($scope.forecastAnalysis.length <= 0) {
						console.log("Equals 0");
						$scope.analysisOutput = false;
					}

					else {
						console.log("Not zero");
						$scope.analysisOutput = true;
					}
				},function(){
					console.log("Analysis error");
				});
	};
	$scope.cleanAnalysis = function () {
		$scope.forecastAnalysis = "";
		console.log("Cleaned!!");
	};

	$scope.displayedUser = {};

	//default user selection
	$scope.profileStats.searchStatus = "all";

	//users search selection choices
	$scope.profileStats.usersSelection = [
		{"name":"All users", "call":"all"},
		{"name":"User's groups", "call": "group"}
	];
	$scope.profileStats.usersSelection.active = $scope.profileStats.usersSelection[0];

	//get users group
	$scope.profileStats.getUsersGroups = function () {

		APIService.postHttp("/personal/group/find",{
			"owner": currentUsername
		})
			.then(function(data){
				console.log(data);
				$scope.profileStats.usersGroups = data;
			},function(){
				console.log("get groups error");
			});
	};
	$scope.profileStats.getUsersGroups();

	//extract users from a selected group
	var getUsersFromGroup = function () {
		$scope.users = profileStats.usersGroup.chosen.members
	};

	//get hovered user
	$scope.profileStats.hoveredUser = function (user) {
		APIService.getHttp("/personal/profile/" + $scope.profileStats.market.selected.symbol + "/" + user)
				.then(function (data) {
					$scope.profileStats.hoveredUser.data = data;
					console.log("User info got for " + user);
				},function(){
					console.log("Hovered user error");
				});
	};

	$scope.profileStats.cleanHoveredUser = function() {
		$scope.profileStats.hoveredUser.data = "";
	};

	$scope.getUpdatedCharts = function() {
		initializeData()
	};

	//calling services containing data. Services handle errors
	var service = {};
	//setting up the initial date
	$scope.profileStats.dateSelection();
	//if custom date is selected
	ifCustomDate();

	service.getAllUsers = function(url) {
		GeneralDataService.getAllUsersService(url)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				console.log("Service Get All Usersr",  data);
				$scope.users = data;

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Get All Users Error', error);
			});
	};
	service.getAllUsers("/personal/return/users");

	//charts
	service.getUserSectorPreference = function (url) {
		UserChartsService.getSectorPreferenceChartService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Sector Preference",  data);
					$scope.profileStats.dateSelection();
					//if custom date is selected
					ifCustomDate();

					var sectorPreference = {};
					var fillChartSectorPreference = function() {
						$scope.profileStats.chart.sectorPreference = [
							{
								key: "Cumulative Return",
								values: [
									{
										"label": "Healthcare",
										"value": sectorPreference.healthcare
									},
									{
										"label": "Financial",
										"value": sectorPreference.financial
									},
									{
										"label": "Industrial Goods",
										"value": sectorPreference.industrialGoods
									},
									{
										"label": "Services",
										"value": sectorPreference.services
									},

									{
										"label": "Consumer Goods",
										"value": sectorPreference.conumerGoods
									},

									{
										"label": "Conglomerates",
										"value": sectorPreference.conglomerates
									},

									{
										"label": "Basic Materials",
										"value": sectorPreference.basicMaterials
									},

									{
										"label": "Technology",
										"value": sectorPreference.technology
									},
									{
										"label": "Utilities",
										"value": sectorPreference.utilities
									}
								]
							}
						];
					};
					fillChartSectorPreference();
					var assignChartSectorPreference = function () {
						sectorPreference.healthcare = data.healthcare;
						sectorPreference.financial = data.financial;
						sectorPreference.industrialGoods = data["industrial goods"];
						sectorPreference.services = data.services;
						sectorPreference.conumerGoods = data["consumer goods"];
						sectorPreference.conglomerates = data.conglomerates;
						sectorPreference.basicMaterials = data["basic materials"];
						sectorPreference.technology = data.technology;
						sectorPreference.utilities = data.utilities;
						fillChartSectorPreference();
					};
					assignChartSectorPreference();


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('error', error);
				});
	};
	service.getMarketCapPreference = function (url) {
		UserChartsService.getMarketCapPreferenceService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Market Cap Preference",  data);
					var marketCapPreference = {};
					var fillChartMarketCapPreference = function() {
						$scope.profileStats.chart.marketCapPreference = [
							{
								key: "Market Cap Preference",
								values: [
									{
										"label": "Mega",
										"value": marketCapPreference.mega
									},
									{
										"label": "Large",
										"value": marketCapPreference.large
									},
									{
										"label": "Mid",
										"value": marketCapPreference.mid
									},

									{
										"label": "Small",
										"value": marketCapPreference.small
									},

									{
										"label": "Micro",
										"value": marketCapPreference.micro
									},

									{
										"label": "Nano",
										"value": marketCapPreference.nano
									}
								]
							}
						];
					};

					var assignMarketCapPreference = function () {
						marketCapPreference.mega = data.mega;
						marketCapPreference.nano = data.nano;
						marketCapPreference.mid = data.mid;
						marketCapPreference.large = data.large;
						marketCapPreference.micro = data.micro;
						marketCapPreference.small = data.small;
						fillChartMarketCapPreference();
					};
					assignMarketCapPreference();


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Market Cap Preference Error', error);
				});
	};
	service.getTotalCorrect = function(url) {
		UserChartsService.getTotalCorrectService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Total Correct",  data);
					var totalCorrect = {};
					var fillChartTotalCorrect = function() {
						$scope.profileStats.chart.totalCorrect = [
							{
								key: "True",
								y: totalCorrect.true,
								color: "#66bb6a"

							},
							{
								key: "False",
								y: totalCorrect.false,
								color: "#d5473e"
							}
						];
					};
					var assignTotalCorrect = function () {
						totalCorrect.true = data.true;
						totalCorrect.false = data.false;
						fillChartTotalCorrect();
					};
					assignTotalCorrect();


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Total Correct Error', error);
				});
	};
	service.getForecastSentiment = function(url) {
		UserChartsService.getForecastSentimentService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Forecast Sentiment",  data);
					var forecastSentiment = {};
					var fillChartForecastSentiment = function() {
						$scope.profileStats.chart.forecastSentiment = [
							{
								key: "Bearish",
								y: forecastSentiment.bearish
							},
							{
								key: "Bullish",
								y: forecastSentiment.bullish
							}
						];
					};
					var assignForecastSentiment = function () {
						forecastSentiment.bearish = data.bearish;
						forecastSentiment.bullish = data.bullish;
						fillChartForecastSentiment();
					};

					assignForecastSentiment()


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Forecast Sentiment Error', error);
				});
	};
	service.getForecastPendingSentiment = function(url) {
		UserChartsService.getForecastPendingSentimentService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Forecast Pending Sentiment",  data);
					if ((data.bearish == 0) && (data.bullish == 0)) {
						data.bearich = 1;
						data.bullish = 1;
					}

					var forecastPendingSentiment = {};
					var fillChartForecastPendingSentiment = function() {
						$scope.profileStats.chart.forecastPendingSentiment = [
							{
								key: "Bearish",
								y: forecastPendingSentiment.bearish
							},
							{
								key: "Bullish",
								y: forecastPendingSentiment.bullish
							}

						];
					};
					var assignForecastPendingSentiment = function () {
						forecastPendingSentiment.bearish = data.bearish;
						forecastPendingSentiment.bullish = data.bullish;
						fillChartForecastPendingSentiment();
					};
					assignForecastPendingSentiment()


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Forecast Pending Sentiment Error', error);
				});
	};
	service.getTimeOfDayPreference = function(url) {
		UserChartsService.getTimeOfDayPreferenceService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Time Of Day Preference",  data);

					var timeOfDayPreference = {};
					var fillChartTimeOfDayPreference = function() {
						$scope.profileStats.chart.timeOfDayPreference = [
							{
								key: "Morning",
								y: timeOfDayPreference.morning
							},
							{
								key: "Midday",
								y: timeOfDayPreference.midday
							},

							{
								key: "Close",
								y: timeOfDayPreference.close
							}

						];
					};
					var assignTimeOfDayPreference = function () {
						timeOfDayPreference.morning = data.morning;
						timeOfDayPreference.midday = data.midday;
						timeOfDayPreference.close = data.close;
						fillChartTimeOfDayPreference();
					};

					assignTimeOfDayPreference();


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Time Of Day Preference Error', error);
				});
	};

	//user related data
	service.getAtGlance = function(url) {
		UserDetailsService.getAtGlanceService(url)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				$scope.profileStats.atGlance = data;
				$scope.username.display = data.user;
				console.log("Service Get At Glance",  data);

				service.getFollowers("/personal/follow/list/" + currentUsername);
				service.getTagline("/personal/tagline/" + currentUsername);
				service.getAvatar("/personal/avatar/" + currentUsername);

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Get At Glance Error', error);
			});

	};

	service.getProfessionTagline = function(url) {
		UserDetailsService.getAtGlanceService(url)
			.then(function(data) {
				// promise fulfilled
				$scope.profileStats.profession = data.profession;
				$scope.profileStats.tagline = data.tagline;

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Get At Profession and tagline', error);
			});
	};

	service.getAvatar = function(url){
		APIService.getHttp(url).then(function(data){
			$scope.profileStats.atGlance.avatar = data.avatar ||  '/userpics/$default.png';
		},function(error){
			console.log('Service Get Avatar Error', error);
		});
	}

	service.getTagline = function(url){
		APIService.getHttp(url).then(function(data){
			$scope.profileStats.atGlance.tagline = data.tagline;
			$scope.profileStats.atGlance.profession = data.profession;

		},function(error){
			console.log('Service Get Tagline Error', error);
		});
	}

	service.getFollowers = function(url) {
		UserDetailsService.getFollowersService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Get Follower",  data);
					$scope.profileStats.followers = _.map(data,function(item){
						var obj = {username:item};
						APIService.getHttp('/personal/avatar/'+item).then(function(avatar){
							obj.avatar = avatar.avatar;
						})
						return obj;
					});
					$scope.profileStats.followersCount = data.length;
					service.getFollowing("/personal/imfollowing/list/" + currentUsername);


				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Get Followers Error', error);
				});
	};
	service.getFollowing = function(url) {
		UserDetailsService.getFollowingService(url)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Get Following",  data);
					$scope.profileStats.following = _.map(data,function(item){
						var obj = {username:item};
						APIService.getHttp('/personal/avatar/'+item).then(function(avatar){
							obj.avatar = avatar.avatar;
						})
						return obj;
					});
					$scope.profileStats.followingCount = data.length;

				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Get Following Error', error);
				});
	};

	//forecasts
	service.getSimpleForecasts = function(market, user, status) {
		if (status == "pending") {
			$scope.profileStats.forecastStatus = "pending";
		}

		else if (status == "validated") {
			$scope.profileStats.forecastStatus = "validated";
		}
		ForecastService.getSimpleForecastsService(market, user, status)
				// then() called when son gets back
				.then(function(data) {
					// promise fulfilled
					console.log("Service Simple Forecasts",  data);
					$scope.profileStats.forecasts = _.map(data,function(item){
						APIService.getHttp('/personal/avatar/'+item.user).then(function(avatar){
							item.avatar = avatar.avatar;
						})
						return item;
					});

				}, function(error) {
					// promise rejected, could log the error with: console.log('error', error);
					console.log('Service Simple Forecast Error', error);
				});
	};
	//calling service function
	$scope.getSimpleForecasts = function(status) {
		//calling service function directly
		service.getSimpleForecasts($scope.profileStats.market.selected.symbol, currentUsername, status);
	};

	//single user related
	service.getAtGlanceCurrentUser = function(url){
		UserDetailsService.getAtGlanceCurrentUserService(url)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				console.log("Service Current User At Glance",  data);
				$scope.profileStats.hoveredUser = data;
				$scope.profileStats.activeGroup = 1;
				console.log("hoveredUser", data);

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Current User At Glance Error', error);
			});
	};
	$scope.getAtGlanceCurrentUser = function(user) {
		service.getAtGlanceCurrentUser("/personal/profile/" + $scope.profileStats.market.selected.symbol +"/" + user)
	};

	//groups related
	service.getMyGroups = function(user){
		UserDetailsService.getMyGroupsService(user)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				console.log("Service get My groups",  data);
				$scope.profileStats.myGroups = _.map(data,function(group){
					group.members = _.map(group.members,function(item){
						var obj = {username:item};
						APIService.getHttp('/personal/avatar/'+item).then(function(avatar){
							obj.avatar = avatar.avatar;
						})
						return obj;
					})
					return group;
				});
				$scope.profileStats.activeGroup = $scope.profileStats.myGroups[0];


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service get my groups Error', error);
			});
	};
	$scope.getMyGroups = function() {
		service.getMyGroups(currentUsername);
	};
	$scope.addActive = function(group) {
		$scope.profileStats.activeGroup = group;
		console.log($scope.profileStats.activeGroup);
	};

	service.createGroup = function(user, groupName, groupDescription, groupMembers) {
		UserDetailsService.createGroupService(user, groupName, groupDescription, groupMembers)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				console.log("Service Create New Group",  data);
				$('#createGroup').modal('hide');
				service.getMyGroups(currentUsername);

				$scope.group.name = "";
				$scope.group.description = "";
				$scope.group.members = "";




			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Create New Group Error', error);
				$('#createGroup').modal('hide')
			});
	};
	$scope.createGroup = function() {
		console.log(currentUsername, $scope.group);
		service.createGroup(currentUsername, $scope.group.name, $scope.group.description, $scope.group.members);

	};

	service.addMemberToGroup = function(members, groupId) {
		UserDetailsService.addMemberToGroupService(members, groupId)
			.then(function(data) {
				// promise fulfilled
				console.log("Service Add Member to Group Group",  data);
				$('#addMemberToGroup').modal('hide');


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Add Member to Group Error', error);

			});
	};
	$scope.addMemberToGroup = function() {
		service.addMemberToGroup($scope.group.members, $scope.profileStats.activeGroup.guid);
	};

	service.removeMemberFromGroup = function(member, groupId) {
		UserDetailsService.removeMemberFromGroupService(member, groupId)
			.then(function(data) {
				// promise fulfilled
				console.log("Service Remove member From Group",  data);
				service.getMyGroups(currentUsername);


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Remove Member From Group Error', error);

			});
	};

	$scope.removeMemberFromGroup = function(member) {
		service.removeMemberFromGroup(member, $scope.profileStats.activeGroup.guid);
	};


	service.deleteGroup = function(groupId) {
		UserDetailsService.deleteGroupService(groupId)
			.then(function(data) {
				// promise fulfilled
				console.log("Service Delete Group",  data);
				service.getMyGroups(currentUsername);

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Delete Group Error', error);

			});
	};

	$scope.deleteGroup = function(groupId) {
		service.deleteGroup(groupId);
	};

	$scope.updateProfessionTagline = function() {
		var apiUrl = "/personal/update/tagline";
		APIService.postHttp(apiUrl,
			{
				"user": logginedUser,
				"profession": $scope.profileStats.profession,
				"tagline": $scope.profileStats.tagline
			}).then(function(data){
			console.log(data);
		},function(err){
			console.error(err);
			//alert("Follow error");
		});
	};

	$scope.dismisEditTag = function() {
		service.getProfessionTagline("/personal/tagline/" + currentUsername);
	};

	$scope.changeMarket = function() {
		market = $scope.profileStats.market.selected.symbol;
	};

	$scope.getCompareChart = function() {
		var apiUrl = "/personal/crank/" + market + "/" + dateRange.start + "until" + dateRange.end;
		APIService.postHttp(apiUrl,
			{
				"metric": "community rank",
				"users":$scope.multiselect.users
			}).then(function(data){
				$scope.lineData = userCompareChart(data);
		}, function(err){
				console.error(err);
		});
	};

	$scope.compareUserUpdate = function() {
		$scope.getCompareChart();
	};
	$scope.isEditProfessionCheck = function() {
		if ($scope.profileStats.atGlance.user.mc_username == $scope.currentUsername) {
			$scope.isEditProfession=true;
		}
	};
	$scope.isEditTaglineCheck = function() {
		if ($scope.profileStats.atGlance.user.mc_username == $scope.currentUsername) {
			$scope.isEditTagline=true;
		}
	};
	//calling charts
	service.getAtGlance("/personal/profile/" + $scope.profileStats.market.selected.symbol + "/" + currentUsername);
	service.getUserSectorPreference("/personal/sector/" + currentUsername + "/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
	service.getMarketCapPreference("/personal/marketcap/" + currentUsername + "/"+ $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
	service.getTotalCorrect("/personal/correctperformance/" + currentUsername +"/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
	service.getForecastSentiment("/personal/sentiment/"+ currentUsername + "/"+ $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
	service.getForecastPendingSentiment("/personal/sentiment_pending/" + currentUsername + "/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
	service.getTimeOfDayPreference("/personal/timeofday/" + currentUsername + "/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
	service.getProfessionTagline("/personal/tagline/" + currentUsername);
	$scope.getCompareChart();

	//functions for refreshing data. Not called initially
	$scope.refreshUserDetailsData = function() {
		service.getAtGlance("/personal/profile/" + $scope.profileStats.market.selected.symbol + "/" + currentUsername);
		service.getProfessionTagline("/personal/tagline/" + currentUsername);
	};
	$scope.refreshChartData = function() {
		console.log("chart data refresh called");
		$scope.profileStats.dateSelection();
		//if custom date is selected
		ifCustomDate();

		service.getUserSectorPreference("/personal/sector/" + currentUsername + "/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
		service.getMarketCapPreference("/personal/marketcap/" + currentUsername + "/"+ $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
		service.getTotalCorrect("/personal/correctperformance/" + currentUsername +"/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
		service.getForecastSentiment("/personal/sentiment/"+ currentUsername + "/"+ $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
		service.getForecastPendingSentiment("/personal/sentiment_pending/" + currentUsername + "/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);
		service.getTimeOfDayPreference("/personal/timeofday/" + currentUsername + "/" + $scope.profileStats.market.selected.symbol + "/" + dateRange.start + "until" + dateRange.end);

		$scope.getCompareChart();
	};
	$scope.redirectToUser = function () {
		console.log("redirected to user")
		newUsername = $scope.username.search;
		currentUsername = newUsername;
		//$scope.refreshChartData();
		$location.path('/user/' + $scope.username.search);
		console.log("redirected to user")
	};

	$scope.followButton = "Follow";
	if(logginedUser!=currentUsername){
		APIService.getHttp('/personal/ifollow/'+logginedUser+'/'+currentUsername).then(function(followingData){
			$scope.followingData = followingData;
			if ($scope.followingData == "yes") {
				$scope.followButton = "Unfollow";
			}else {
				$scope.followButton = "Follow";
			}
		})
	}

	$scope.followUser = function(){
		var followUnfollowLink;

		if ($scope.followingData == "no") {
			followUnfollowLink = "/personal/follow/add";
			$scope.followButton = "Unfollow";
		}

		else {
			followUnfollowLink = "/personal/follow/remove";
			$scope.followButton = "Follow";
		}

		APIService.postHttp(followUnfollowLink,
			{
				"user": logginedUser,
				"member": currentUsername
			}).then(function(data){
			console.log(data);
		},function(err){
			console.error(err);
			//alert("Follow error");
		});
	}

	//displaying charts correctly if they were in the hidden tab
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		window.dispatchEvent(new Event('resize'));
	});

	/*
	 TODO: Make pagination work on user following
	 TODO: Reimplement pagination or infinite scroll
	 */
});