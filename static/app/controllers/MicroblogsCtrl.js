App.controller ('MicroblogsCtrl',['$scope', '$http', 'MicroblogsService', 'GeneralDataService', 'UserDetailsService', '$location','APIService', 'Notification', function ($scope, $http, MicroblogsService, GeneralDataService,UserDetailsService,$location,API,Notification){
	var currentUsername = UserDetailsService.getUser().mc_username;
	$scope.currentUsername=currentUsername;
	console.log('currentUser',currentUsername);
	var periodicalReqiestInterval;
	var periodicalRequestParams;

	var maxMessagesInit = 9;
	var messagesMoreStep = 9;
	$scope.maxMessages = maxMessagesInit;
	$scope.microblogs = {};
	$scope.microblogs.formFocused = false;

	$scope.microblogs.new = {};
	$scope.microblogs.new.markets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	$scope.microblogs.new.market= $scope.microblogs.new.markets[0];

	$scope.microblogs.filter = {};
	$scope.microblogs.filters = [
		{name: 'Default', query_type: 'default'},
		{name: 'Only Me', query_type: 'onlyme'},
		{name: 'Users', query_type: 'userlist'},
		{name: 'Sectors', query_type: 'sectors'},
		{name: 'Symbols', query_type: 'symbols'}
	];
	$scope.microblogs.filter = $scope.microblogs.filters[0];
	$scope.sectors = ["utilities", "services", "industrial goods", "consumer goods", "conglomerates", "financial", "healthcare", "basic materials", "technology"];
	$scope.microblogs.filterMarket = $scope.microblogs.new.markets[0];

	$scope.showMoreMessages = function(){
		$scope.maxMessages+=messagesMoreStep;
	};


	GeneralDataService.getAllUsersService("/personal/return/users")
		// then() called when son gets back
		.then(function(data) {
			// promise fulfilled
			console.log("Service Get All Usersr",  data);
			$scope.users = data;

		}, function(error) {
			// promise rejected, could log the error with: console.log('error', error);
			console.log('Service Get All Users Error', error);
		});

	//watching for market changes
	$scope.$watch(function(){
		return $scope.microblogs.filterMarket
	}, function(){
		console.log('$scope.$scope.microblogs.filterMarket',$scope.microblogs.filterMarket);
		stock_info_market = $scope.microblogs.filterMarket.symbol;
		$scope.liveSearchSymbol("/personal/getsymbols/"+stock_info_market);
		//if (stock_info_market == 'us') {
		//
		//	//stock_info_market = "us";
		//	stock_info_symbol = "googl";
		//	stock_info_symbol_rss = "googl";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol;
		//	$scope.liveSearchSymbol("/personal/getsymbols/us");
		//}
		//
		//else if (stock_info_market == 'to') {
		//
		//	//stock_info_market = "to";
		//	stock_info_symbol = "pow";
		//	stock_info_symbol_rss = "pow.to";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".to";
		//	$scope.liveSearchSymbol("/personal/getsymbols/to");
		//}
		//
		//else if (stock_info_market == 'l') {
		//	//stock_info_market = "l";
		//	stock_info_symbol = "rr";
		//	stock_info_symbol_rss = "rr.l";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".l";
		//	$scope.liveSearchSymbol("/personal/getsymbols/uk");
		//
		//}
		//
		//else if (stock_info_market == 'hk') {
		//	//stock_info_market = "hk";
		//	stock_info_symbol = "0168";
		//	stock_info_symbol_rss = "0168.kh";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".hk";
		//	$scope.liveSearchSymbol("/personal/getsymbols/hk");
		//}
		//
		//else if (stock_info_market == 'de') {
		//	//stock_info_market = "de";
		//	stock_info_symbol = "cbk";
		//	stock_info_symbol_rss = "cbk.de";
		//	stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".de";
		//	$scope.liveSearchSymbol("/personal/getsymbols/de");
		//}
		//
		//else {
		//	console.log("Market Selection Error");
		//}

		//$scope.getData();
		//$scope.updateChart();
		//console.log("Radio Model is " + $scope.marketSelectionSwitcher);
	});


	//live search
	$scope.liveSearchSymbol = function(apiUrl) {
		API.getHttp(apiUrl)
			.then(function (data) {
				$scope.selected = undefined;
				$scope.symbols = data;
			},function(response) {
				console.error('Gists error', response.status, response.data);
			});

	};





$scope.test = function(){
	API.postHttp('/personal/fe2ed/query',{user:'d', market:"us", query_type:"default"}).then(function(data) {
		console.log('me',data);
	})
}

	$scope.getDefaultMicroblogs = function(user) {

		MicroblogsService.getMicroblogsService({user:user, market:"us", query_type:"default"})
			.then(function(data) {
				console.log("Service Microblogs", data);

				$scope.microblogs.data = data.results;
				$scope.microblogs.tstamp = data.tstamp;
				startPeriodicalRequests();
				processMessages($scope.microblogs.data);
				MicroblogsService.getRepliesCount($scope.microblogs.data);
				sortMessages();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error', error);
			});
	};
	$scope.getDefaultMicroblogs(currentUsername);


	$scope.getMicroblogs = function(data){
		//$scope.getDefaultMicroblogs(currentUsername);
		MicroblogsService.getMicroblogsService(data)
			.then(function(data){
				console.log("Service Microblogs2", data);
				$scope.maxMessages = maxMessagesInit;
				//startPeriodicalRequests();
				$scope.microblogs.data = data.results;
				if(!_.isEmpty(data.results)){
					processMessages($scope.microblogs.data);
					MicroblogsService.getRepliesCount($scope.microblogs.data);
					sortMessages();
				}
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error2', error);
			});
	};

	$scope.formatLabel = function(model){

		var res  = _.find($scope.symbols,{symbol:model})
		if(res){
			return res.name;
		}


	};

	$scope.submitFilters = function(){
		var q = _.pick($scope.microblogs.filter,['query_type','market']);
		q.market = $scope.microblogs.filterMarket.symbol;
		//q.query_type = $scope.microblogs.filter;
		q.user = currentUsername;
		if($scope.microblogs.filter.symbol){q.symbols = $scope.microblogs.filter.symbol};
		if($scope.microblogs.filter.sector){q.sectors = $scope.microblogs.filter.sector};
		if($scope.microblogs.filter.user){q.userlist = $scope.microblogs.filter.user;};

		//if(q.query_type=='onlyme'){q.user = currentUsername;}
		if(!checkSumbitFilters(q)){
			Notification.error('Some fields required are empty');
			return;
		}

		startPeriodicalRequests();// IT SAVES PERIODICAL REQUEST PARAMS

		$scope.getMicroblogs(q);
		//startPeriodicalRequests();
		//$scope.maxMessages = maxMessagesInit;
		//sortMessages();
		//$scope.microblogs.filter.sector=null;
		//$scope.microblogs.filter.symbol=null;
		//$scope.microblogs.filter.user=null;
	};

	$scope.createTopic = function() {
		MicroblogsService.createTopic(currentUsername, $scope.microblogs.new.message, $scope.microblogs.new.market.symbol)
			.then(function(data) {
				// promise fulfilled
				$scope.microblogs.new.response = data;
				$scope.microblogs.new.message = "";
				$scope.microblogs.formFocused = false;
				console.log("Service New Topic Response",  $scope.microblogs.data);
				//$scope.getDefaultMicroblogs(currentUsername, "us", "default");
				//$scope.submitFilters();
			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service New Topic Error', error);
			});
	};

	$scope.getReplies = function(theme_id) {
		MicroblogsService.getRepliesService(currentUsername, "us", theme_id)
			.then(function(data) {
				// promise fulfilled
				$scope.microblogs.replies = data.results;
				processMessages($scope.microblogs.replies);
				console.log("Service Microblogs Replies",  $scope.microblogs.data);
				_.each($scope.microblogs.replies,function(reply){
					API.getHttp('/personal/avatar/'+reply.user).then(function(avatar){
						reply.avatar = avatar.avatar;
					})
				})

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Default Microblogs Error', error);
			});
	};

	$scope.sendReply = function(theme_id) {
		MicroblogsService.sendReplyService(currentUsername, theme_id, $scope.microblogs.replyData)
			.then(function(data) {
				// promise fulfilled
				console.log("Service Microblogs Send Reply",  $scope.microblogs.data);
				$scope.microblogs.replyData = "";
				$scope.getReplies($scope.microblogs.clickedMicroblogElement.theme_id);
				$scope.microblogs.clickedMicroblogElement.replies += 1;
				$scope.dismissReplyForm();

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Microblogs Send Reply Error', error);
			});
	};

	$scope.getClickedMicroblogElement = function(element) {
		$scope.microblogs.replies = "";
		console.log(element);
		$scope.microblogs.clickedMicroblogElement = element;
		$scope.getReplies(element.theme_id);
	};

	$scope.dismissCreateMicroblogForm = function() {
		$scope.microblogs.formFocused = false;
		$scope.microblogs.new.message = "";
	};

	$scope.dismissReplyForm = function() {
		$scope.microblogs.clickedMicroblogElement = null;
	};

	$scope.getSymbols = function(market) {
		GeneralDataService.getSymbols(market)
			.then(function(data) {
				// promise fulfilled
				console.log("Service GET SYMBOLS",  $scope.microblogs.data);
				$scope.microblogs.symbols = data;


			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service SYMBOLS Error', error);
			});
	};
	$scope.getSymbols($scope.microblogs.filterMarket.symbol);

	$scope.microblogs.filter.sector = [];
	$scope.microblogs.filter.sectors = ["utilities", "services", "industrial goods", "consumer goods", "conglomerates", "financial", "healthcare", "basic materials", "technology"];


	$scope.gotoProfile = function(username){
		$location.path('/user/'+username);
		//"#/user/{{reply.user}}"
	}


	function processMessages(messages){
		console.log('\n P M ',messages)
		_.each(messages,function(message){
			processMessage(message);
		});
	}

	var reBold = /([\$\#\@]\S+)/ig;
	var reLink = /((?:http:\/\/\S+\.\S+)|(?:https:\/\/\S+\.\S+)|(?:w{3}\S+\.\S+)|(?:\S+\.(?:ru|com|net|png|jpg|jpeg|bmp)))/ig;
	function processMessage(message){
		message.message =  String(message.message).replace(reBold,"<strong>$1</strong>");
		message.message =  String(message.message).replace(reLink,"<a href='$1' target='_blank'>$1</a>");
		message.reply =  String(message.reply).replace(reBold,"<strong>$1</strong>");
		message.reply =  String(message.reply).replace(reLink,"<a href='$1' target='_blank'>$1</a>");
			API.getHttp('/personal/avatar/'+String(message.user).toLowerCase()).then(function(avatar){
				message.avatar = avatar.avatar;
			})
	}

	function doPeriodicalRequest(){
		MicroblogsService.getPushMessages(periodicalRequestParams.query_type,periodicalRequestParams.market,periodicalRequestParams.tstamp,periodicalRequestParams).then(function(res){
			if(res.results && !_.isEmpty(res.results)){
				processMessages(res.results);
				$scope.microblogs.data = _.unionBy($scope.microblogs.data,res.results,'theme_id');
				sortMessages();
			};
			$scope.microblogs.tstamp = res.tstamp;
			periodicalRequestParams.tstamp = res.tstamp;
		});
		MicroblogsService.getRepliesCount($scope.microblogs.data);

	};

	function startPeriodicalRequests(){
		periodicalRequestParams = {
			tstamp:$scope.microblogs.tstamp,
			query_type:$scope.microblogs.filter.query_type,
			market:$scope.microblogs.new.market.symbol,
			sector:$scope.microblogs.filter.sector,
			symbol:$scope.microblogs.filter.symbol,
			userlist:$scope.microblogs.filter.user,
			username:currentUsername,
			microblogs: _.cloneDeep($scope.microblogs)
		};
		if(periodicalReqiestInterval){
			clearInterval(periodicalReqiestInterval)
		}
		periodicalReqiestInterval = setInterval(doPeriodicalRequest,7000)


	}


	function sortMessages(){
		$scope.microblogs.data = _.sortBy($scope.microblogs.data,function(item){
			return -item.activity_timestamp;
		})
	}

	function checkSumbitFilters(q){
		if(q.query_type=='sectors' && (!q.sectors || _.isEmpty(q.sectors)) ){
			return false;
		}else if (q.query_type=='symbols' && (!q.symbols || _.isEmpty(q.symbols)) ){
			return false;
		}else{
			return true;
		}
	}

	$scope.$on('$destroy',function(){
		if(periodicalReqiestInterval){
			clearInterval(periodicalReqiestInterval)
		}
	})
}]);