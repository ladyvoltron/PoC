'use strict';

var city = angular.module('appPoc.city', [
  'ngRoute'
])

city.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fe/city', {
    templateUrl: 'modules/city/city.html',
    controller: 'cityController',
//    resolve: {
//    factory: checkRouting
//  }
})
.otherwise({redirectTo: '/fe/user/login'});
}]);

// ===== City detailed view =====
city.controller('cityController', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
  console.log('Hi, I am cityController');
  $scope.auth_token = $cookies.get('poc.auth_token');
  $scope.city_id    = $cookies.get('poc.city_id');

  // Get all countries from API
  $scope.getCityInfo = function () {
    console.log('get info for city id  ' + $scope.city_id);
    if ( angular.isUndefined($scope.city_id)) {
      console.log('city_id is not defined, redirecting to cities page');
      $location.path('/fe/cities');
    }
    $http({
      url: 'http://localhost:8090/be/city/info',
      method: 'GET',
      params: {token: $scope.auth_token, city_id: $scope.city_id},
      headers: {'Content-Type': 'application/json'}
    })
        .success(function (nodeResponse) {
          console.log('city info get request is successful');
          $scope.cityInfo = nodeResponse;
          if ( angular.isDefined($scope.nodeResponse.error) ) {
            console.log('Error connection to API (cookie expired), redirecting to login page');
            $location.path('/fe/user/login');
          }
        })
        .error(function (response) {
          console.log('Error connection to API (cookie expired), redirecting to login page');
          $location.path('/fe/user/login');
        })
  };

  $scope.getCityInfo();

  // Back to cities selection page
  $scope.back = function() {
    $cookies.remove("poc.city_id");
    $location.path('/fe/cities');
  }
}]);


// ===== Checking if a user is logged in, i.e. auth_token is present in cookie
var checkRouting = function ($q, $rootScope, $location, $http, $cookies) {
  console.log('location path is ' + $location.path());
  if ($cookies.get('poc.auth_token') != null) {
    console.log('cookie exists! ' + $cookies.get('poc.auth_token'));
  } else {
    console.log('cookie does not exist, redirecting to login page!');
    $rootScope.appReferrer = $location.path();
    $location.path("/fe/user/login");
  }
};