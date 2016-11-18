App.factory('ForecastService', ['APIService',function (API) {
	return {
		getSimpleForecastsService: function(market, user, status) {
			// the $http API is based on the deferred/promise APIs exposed by the $q service
			// so it returns a promise for us by default
			return API.postHttp("/personal/masterquery/"+ market + "/" + user,
				{
					"user": user,
					"symbol":"all",
					"movement":"all",
					"timeofday":"all",
					"percentage":"all",
					"mcapcategory":"all",
					"sector":"all",
					"correct": status,
					"startdate" :"09/15/15",
					"enddate": "01/17/25"
				}
			);
		}
	};
}]);
