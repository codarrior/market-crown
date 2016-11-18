App.controller ('StockInfoWrapperCtrl', function StockInfoCtrl ($scope){
	$scope.$on('loadStockInfo',function(){$scope.loadingStockInfo=true});
	$scope.$on('unloadStockInfo',function(){$scope.loadingStockInfo=false});

	$scope.$on('loadProfileInfo',function(){$scope.loadingProfileInfo=true});
	$scope.$on('unloadProfileInfo',function(){$scope.loadingProfileInfo=false});

});