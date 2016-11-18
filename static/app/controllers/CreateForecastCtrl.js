App.controller ('CreateForecastCtrl', function StockInfoCtrl ($scope, $http, GeneralDataService,Notification){

	$scope.dateOptions = {
		changeYear: true,
		changeMonth: true,
		yearRange: '1900:-0'
	};

	$scope.newForecast = {};
	$scope.newForecast.markets = [
		{name: 'US Market', symbol: 'us', flag: 'us-flag.png'},
		{name: 'CA Market', symbol: 'ca', flag: 'ca-flag.png'},
		{name: 'UK Market', symbol: 'uk', flag: 'uk-flag.png'},
		{name: 'DE Market', symbol: 'de', flag: 'de-flag.png'},
		{name: 'HK Market', symbol: 'hk', flag: 'hk-flag.png'}
	];
	$scope.newForecast.market= $scope.newForecast.markets[0];

	$scope.newForecast.percentages = [
		{name: ".2-.9%", symbol: ".2-.9%"},
		{name: "1-5%", symbol: "1-5%"},
		{name: "6-15%", symbol: "6-15%"},
		{name: "16-30%", symbol: "16-30%"},
		{name: "31+%", symbol: "31+%"}
	];
	$scope.newForecast.percentage = $scope.newForecast.percentages[0];

	$scope.newForecast.dayTimes = [
		{name: 'Morning', symbol: 'morning'},
		{name: 'Midday', symbol: 'midday'},
		{name: 'Close', symbol: 'close'}
	];
	$scope.newForecast.dayTime = $scope.newForecast.dayTimes[0];

	$scope.newForecast.marketMovements = [
		{name: 'UP', symbol: 'up', flag: 'up.png'},
		{name: 'DOWN', symbol: 'down', flag: 'down.png'}
	];
	$scope.newForecast.marketMovement = $scope.newForecast.marketMovements[0];

	$scope.createForecast = function() {
		var regExp = /\(([^)]+)\)/;
		var stockSymbolFormatted;

		var symbolObjStr = JSON.stringify($scope.newForecast.symbol);
		var symbolObjLength = symbolObjStr.length;

		if (symbolObjLength >= 15) {
			var formattedSymbol = regExp.exec($scope.newForecast.symbol);
			stockSymbolFormatted = formattedSymbol[1];

			if ($scope.newForecast.market.symbol === "ca") {
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
			}

			else if ($scope.newForecast.market.symbol === "uk"){
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-2);
			}


			else if ($scope.newForecast.market.symbol === "de"){
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
			}


			else if ($scope.newForecast.market.symbol === "hk"){
				stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
			}
		}

		else {
			stockSymbolFormatted = $scope.newForecast.symbol;
		}


		GeneralDataService.createForecastService("jcramer", stockSymbolFormatted, $scope.newForecast.marketMovement.symbol, $scope.newForecast.date, $scope.newForecast.dayTime.symbol, $scope.newForecast.percentage.symbol, $scope.newForecast.market.symbol, $scope.newForecast.analysis)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				// console.log("Service Create Forecasts",  data);
				Notification.success("Forecast Successfully Created");
				$scope.newForecast.symbol = "";
				//$scope.newForecast.marketMovement = "";
				$scope.newForecast.date = "";
				$scope.newForecast.dayTime = "";
				$scope.newForecast.percentage = "";
				//$scope.newForecast.market = "";
				$scope.newForecast.analysis = "";

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Create Forecast Error', error);
			});

	};

	//initial call for the symbols
	GeneralDataService.getSymbols("us")
	// then() called when son gets back
	.then(function(data) {
		// promise fulfilled
		// console.log("Service Symbols",  data);
		$scope.symbols = data;

	}, function(error) {
		// promise rejected, could log the error with: console.log('error', error);
		console.log('Service Symbols Error', error);
	});

	$scope.refreshSymbols = function() {
		//initial call for the symbols
		GeneralDataService.getSymbols($scope.newForecast.market.symbol)
			// then() called when son gets back
			.then(function(data) {
				// promise fulfilled
				// console.log("Service Symbols",  data);
				$scope.symbols = data;
				$scope.newForecast.symbol = "";

			}, function(error) {
				// promise rejected, could log the error with: console.log('error', error);
				console.log('Service Symbols Error', error);
			});
	}

});
