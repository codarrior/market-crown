App.factory('UserChartsService', ['APIService',function (API) {
	return {
		getSectorPreferenceChartService: API.getHttp,
		getMarketCapPreferenceService: API.getHttp,
		getTotalCorrectService: API.getHttp,
		getForecastSentimentService: API.getHttp,
		getForecastPendingSentimentService: API.getHttp,
		getTimeOfDayPreferenceService: API.getHttp

	};
}]);
