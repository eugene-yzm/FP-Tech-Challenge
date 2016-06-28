'use strict';

/* Controller */
angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http, $window) {
		// Insert controller code here
		$scope.formInfo = {};
		$scope.selectedBrand;

		$window.onload = function() {
			console.log('Initializing Webpage');
			$http.get('/api/apparel?all')
			.success(function(response){
				 //your code in case the post succeeds
				 console.log('Get all success');
				 var resp = response;
				 $scope.shirts = resp;
				 $scope.selectedBrand = resp[0].brand;
			 })			
			.error(function(err){
				 //your code in case your post fails
				 console.log(err);
			 });
		};

		$scope.submitForm = function() {
			console.log($scope.formInfo);
			$http.post('/api/quote', $scope.formInfo)
			.success(function(response){
				 //your code in case the post succeeds
				 console.log('Success');
				 console.log(response);
			 })
			.error(function(err){
				 //your code in case your post fails
				 console.log(err);
			 });
		}
	
	});