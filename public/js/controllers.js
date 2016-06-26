'use strict';

/* Controller */
angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http) {
		// Insert controller code here
	$scope.formInfo = {};	

	console.log('asdf');
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
	}});