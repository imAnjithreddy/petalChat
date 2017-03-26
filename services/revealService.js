(function(angular) {
	'use strict';
	angular.module('petal.post').
	service('revealService', ['$http', 'homeService',RevealService]);


	function RevealService($http, homeService) {
		this.initiate = initiate;
		this.accept = accept;
		this.ignore = ignore;
		this.cancel = cancel;
		this.received = received;
		this.requested = requested;
		this.revealed = revealed;
		this.finish = finish;


		function initiate(params) {

			return $http.get(homeService.baseURL + 'reveal/initiate', { params: params });
		}

		function accept(params) {
			return $http.get(homeService.baseURL + 'reveal/accept', { params: params });
		}

		function ignore(params) {
			return $http.get(homeService.baseURL + 'reveal/ignore', { params: params });
		}

		function cancel(params) {
			return $http.get(homeService.baseURL + 'reveal/cancel', { params: params });
		}

		function received(params) {
			return $http.post(homeService.baseURL + 'reveal/received', {params:params});
				
		}

		function requested(params) {
			return $http.post(homeService.baseURL + 'reveal/requested', {params:params});
		}

		function revealed(params) {
			return $http.post(homeService.baseURL + 'reveal/revealed', {params:params});
		}
		function finish(params) {
			return $http.post(homeService.baseURL + 'reveal/finish', {params:params});
		}

	}
})(window.angular);