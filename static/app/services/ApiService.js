App.service('APIService', ['$http','$q','Notification', function ($http,$q,Notification) {

	var headers = {'Content-Type': 'application/json'};
	var urlBase = (window.location.host=='localhost:3000')?'http://localhost:3000/api/v1':'https://marketcrown.com/api/v1';
	// var urlBase = (window.location.host=='192.168.0.33:3000')?'http://192.168.0.33:3000/api/v1':'https://marketcrown.com/api/v1';

console.log(window.location.host)
	function getHttp(url,data,ignoreLoadingBar){
		var data = data?data:{};
		return request({
			method: 'GET',
			url:urlBase+url,
			headers:headers,
			data:data,
			ignoreLoadingBar:ignoreLoadingBar
		},ignoreLoadingBar)
	}

	function postHttp(url,data,ignoreLoadingBar){
		var data = data?data:{};
		return request({
			method: 'POST',
			url:urlBase+url,
			headers:headers,
			data:data,
			ignoreLoadingBar:ignoreLoadingBar
		})
	}


	function request(req,ignoreLoadingBar){
		return $q(function(resolve, reject) {
			$http(req,{ignoreLoadingBar:ignoreLoadingBar}).then(function (res) {
				if (!res || !res.data) {
					Notification.error('Unknown error');
					console.error('Responce error');
					reject('Responce error');
				} else if (res.data.error) {
					Notification.error(res.data.error);
					console.error('Responce error',res.data.error);
					reject(res.data.error)
				} else {
					// console.log('>>[',req.method,'] ' ,req.url ,'\n <<',res.data);
					resolve(res.data)

				}
			}, function (err) {

				Notification.error('Unknown error');
				reject(err)
			})
		});
	}

	return {
		getHttp:getHttp,
		postHttp:postHttp
	};
}]);
