App.factory('GeneralDataService', ['APIService',function (API) {
	return {
		getAllUsersService: function(url) {
			return API.getHttp(url, {
					ignoreLoadingBar: true,
					cache: true
				});
		},

		getSymbols: function(market) {
			return API.getHttp("/personal/getsymbols/" + market, {
					ignoreLoadingBar: true
				})
		},

		createForecastService: function(user, symbol, movement, date, timeOfDay, percent, market, analysis) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			var regExp = /\(([^)]+)\)/;
			var stockSymbolFormatted;

			var symbolObjStr = JSON.stringify(symbol);
			var symbolObjLength = symbolObjStr.length;

			if (symbolObjLength >= 15) {
				var formattedSymbol = regExp.exec(symbol);
				stockSymbolFormatted = formattedSymbol[1];

				if (market === "ca") {
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
				}

				else if (market === "uk"){
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-2);
				}


				else if (market === "de"){
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
				}


				else if (market === "hk"){
					stockSymbolFormatted = stockSymbolFormatted.substr(0, stockSymbolFormatted.length-3);
				}
			}

			else {
				stockSymbolFormatted = symbol;
			}

			return API.postHttp('/personal/createforecast', {
					"user": user,
					"symbol": stockSymbolFormatted,
					"movement": movement,
					"date" : date,
					"timeofday" : timeOfDay,
					"percent": percent,
					"market": market,
					"analysis": analysis
				});
		}
	};
}]);
