App.controller ('StockInfoCtrl',['$scope', 'FeedService', 'APIService', function ($scope, Feed, API){

	var stock_info_market = "us";   	//default market value
	var stock_info_symbol = "googl";	//default symbol values
	var stock_info_symbol_rss = "googl";	//default rss stock symbol values

	//default get call
	var stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol;
	console.log("Default get call " + stock_info_full_link);



	//getData function. Calling default data
	$scope.getData = function() {
		$scope.$emit('loadStockInfo');

		API.getHttp(stock_info_full_link)
			.then(function (data) {
				$scope.stock = data;
				console.log("Successfull GET call " + stock_info_full_link);
				$scope.$emit('unloadStockInfo');
			},function(response) {
				console.error('Gists error', response.status, response.data);
				$scope.$emit('unloadStockInfo');
			});
	};

	//Resending the GET request, and retrieving the data based on the user input. The default is US GOOGL.
	$scope.updateStockInfo = function() {

		//preparing the api data ie pulling the symbol in parenthesis if returning full object, othervise use what's entered
		var regExp = /\(([^)]+)\)/;
		var stockInfoSymbolFormatted;


		var symbolObjStr = JSON.stringify($scope.stock_info_symbol_input);
		var symbolObjLength = symbolObjStr.length;

		if (symbolObjLength >= 15) {
			var formattedSymbol = regExp.exec($scope.stock_info_symbol_input);
			stockInfoSymbol = formattedSymbol[1];
			stock_info_symbol_rss = stockInfoSymbol;
		}

		else {
			stockInfoSymbol = $scope.stock_info_symbol_input;
			stock_info_symbol_rss = stockInfoSymbol;
		}



		if ($scope.marketSelectionSwitcher == 'us') {
			stock_info_market = "us";
			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stockInfoSymbol;
		}

		else if ($scope.marketSelectionSwitcher == 'to') {

			stock_info_market = "to";

			//checking if the returned object is full object, if so, pull only a symbol, and remove the sufix.
			if (symbolObjLength >= 15) {
				stockInfoSymbolFormatted = stockInfoSymbol.substr(0, stockInfoSymbol.length-3);
			}

			//if not, use what's entered
			else {
				stockInfoSymbolFormatted = stockInfoSymbol;
			}

			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stockInfoSymbolFormatted + ".to";
		}

		else if ($scope.marketSelectionSwitcher == 'l') {
			stock_info_market = "l";

			//checking if the returned object is full object, if so, pull only a symbol, and remove the sufix.
			if (symbolObjLength >= 15) {
				stockInfoSymbolFormatted = stockInfoSymbol.substr(0, stockInfoSymbol.length-2);
			}

			//if not, use what's entered
			else {
				stockInfoSymbolFormatted = stockInfoSymbol;
			}

			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stockInfoSymbolFormatted + ".l";
		}

		else if ($scope.marketSelectionSwitcher == 'hk') {
			stock_info_market = "hk";

			//checking if the returned object is full object, if so, pull only a symbol, and remove the sufix.
			if (symbolObjLength >= 15) {
				stockInfoSymbolFormatted = stockInfoSymbol.substr(0, stockInfoSymbol.length-3);
			}

			//if not, use what's entered
			else {
				stockInfoSymbolFormatted = stockInfoSymbol;
			}


			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stockInfoSymbolFormatted + ".hk";
		}

		else if ($scope.marketSelectionSwitcher == 'de') {
			stock_info_market = "de";

			//checking if the returned object is full object, if so, pull only a symbol, and remove the sufix.
			if (symbolObjLength >= 15) {
				stockInfoSymbolFormatted = stockInfoSymbol.substr(0, stockInfoSymbol.length-3);
			}

			//if not, use what's entered
			else {
				stockInfoSymbolFormatted = stockInfoSymbol;
			}


			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stockInfoSymbolFormatted + ".de";
		}

		$scope.getData();
		$scope.stock_info_symbol_input = "";
	};

	//chart update ==========================================

	$scope.updateChart = function() {

		$scope.chartPeriod = [
			{name: "Today Chart", link: "b?s="},
			{name: "Five Day Chart", link: "w?s="},
			{name: "Three Month Chart", link: "c/3m/"},
			{name: "Six Month Chart", link: "c/6m/"},
			{name: "One Year Chart", link: "c/1y/"},
			{name: "Max Chart", link: "c/my/"}
		];

		$scope.chartPeriodSelected = $scope.chartPeriod [0];

	};

	//Changing the market.===========================================
	$scope.singleModel = 1;
	$scope.marketSelectionSwitcher = 'us';
	$scope.checkModel = {
		us: true,
		to: false,
		l:  false,
		hk: false,
		de: false
	};
	//watch for market changes. If the user changes the market, it calls updateStockInfoParams() resets the params
	//and call for a new GET method
	$scope.checkResults = [];

	//watching for market changes
	$scope.$watch('marketSelectionSwitcher', function(){

		stock_info_market = $scope.marketSelectionSwitcher;

		if ($scope.marketSelectionSwitcher == 'us') {

			stock_info_market = "us";
			stock_info_symbol = "googl";
			stock_info_symbol_rss = "googl";
			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol;
			$scope.liveSearchSymbol("/personal/getsymbols/us");
		}

		else if ($scope.marketSelectionSwitcher == 'to') {

			stock_info_market = "to";
			stock_info_symbol = "pow";
			stock_info_symbol_rss = "pow.to";
			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".to";
			$scope.liveSearchSymbol("/personal/getsymbols/to");
		}

		else if ($scope.marketSelectionSwitcher == 'l') {
			stock_info_market = "l";
			stock_info_symbol = "rr";
			stock_info_symbol_rss = "rr.l";
			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".l";
			$scope.liveSearchSymbol("/personal/getsymbols/uk");

		}

		else if ($scope.marketSelectionSwitcher == 'hk') {
			stock_info_market = "hk";
			stock_info_symbol = "0168";
			stock_info_symbol_rss = "0168.kh";
			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".hk";
			$scope.liveSearchSymbol("/personal/getsymbols/hk");
		}

		else if ($scope.marketSelectionSwitcher == 'de') {
			stock_info_market = "de";
			stock_info_symbol = "cbk";
			stock_info_symbol_rss = "cbk.de";
			stock_info_full_link = "/personal/fullinfo/" + stock_info_market + "/" + stock_info_symbol + ".de";
			$scope.liveSearchSymbol("/personal/getsymbols/de");
		}

		else {
			console.log("Market Selection Error");
		}

		$scope.getData();
		$scope.updateChart();
		console.log("Radio Model is " + $scope.marketSelectionSwitcher);
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

	//rss feed
	$scope.loadFeed=function(e){
		Feed.parseFeed("https://finance.yahoo.com/rss/headline?s=" + stock_info_symbol_rss).then(function(res){
			$scope.loadButonText=angular.element(e.target).text();
			$scope.feeds=res.data.responseData.feed.entries;
			console.log(stock_info_symbol_rss);
		});
	}
}]);


//TODO redo RSS
App.factory('FeedService',['$http',function($http){
	return {
		parseFeed : function(url){
			return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
		}
	}
}]);
