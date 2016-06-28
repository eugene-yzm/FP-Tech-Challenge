'use strict';

/* Controller */
angular.module('myApp.controllers', []).
	controller('AppCtrl', function ($scope, $http, $window) {
		// Insert controller code here
		$scope.formInfo = {};
		$scope.selectedBrand;
		$scope.shirts;
		$scope.quote;

		$window.onload = function() {
			console.log('Initializing Webpage');
			$http.get('/api/apparel?all')
			.success(function(response){
				 //your code in case the post succeeds
				 console.log('Get all success');
				 var resp = response;
				 $scope.shirts = resp;
				 $scope.selectedBrand = 0;
			 })			
			.error(function(err){
				 //your code in case your post fails
				 console.log(err);
			 });
		};

		$scope.submitForm = function() {
			$scope.formInfo.color_code = $scope.selectedColor;
			$scope.formInfo.style_code = $scope.shirts[$scope. selectedBrand].style_code;
			$scope.formInfo.size_code = $scope.selectedSize;
			$scope.formInfo.amount = $scope.selectedAmount;
			$scope.formInfo.weight = $scope.shirts[$scope. selectedBrand].weight;
			console.log($scope.formInfo);
			$http.post('/api/quote', $scope.formInfo)
			.success(function(response){
				 //your code in case the post succeeds
				 console.log('Success');
				 var resp = response;
				 console.log(resp);
				 $scope.quote = resp;
			 })
			.error(function(err){
				 //your code in case your post fails
				 console.log(err);
			 });
			 $scope.formInfo = {};
		}
		
		$scope.formatList = function(s, delim) {
			if (s==null){
				return [];
			}
			else{
				var a=s.split(delim).sort();
				return a;				
			}
		}
		$scope.number2money = function (num) {
		return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
	
	});