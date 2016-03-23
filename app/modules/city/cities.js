'use strict';

var cities = angular.module('appPoc.cities', [
  'ngRoute'
])

// ===== Routing =====
cities.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fe/cities', {
    templateUrl: 'modules/city/cities.html',
    controller: 'citiesController',
    resolve: {
        factory: checkRouting
    }
  })
  .otherwise({redirectTo: '/fe/user/login'});
}]);

// ===== Controller for couontry/city selection page =====
cities.controller('citiesController', [
  '$scope',
  '$http',
  '$cookies',
  '$location',
  function($scope, $http, $cookies, $location) {

  console.log('Hi, I am citiesController');

  // Check if authentication token cookie exists
  $scope.auth_token = $cookies.get('poc.auth_token');
  $scope.countries = {};
  $scope.cities = {};

  // Get all countries from API
  $scope.getCountries = function () {
    console.log('get countries request to backend, token is ' + $scope.auth_token);
    $http({
      url: 'http://localhost:8090/be/cities/countries',
      method: 'GET',
      params: {token: $scope.auth_token},
      headers: {'Content-Type': 'application/json'}
    })
    .success(function (nodeResponse) {
        console.log('countries get request is successful');
        $scope.countries = nodeResponse;
        if ( angular.isDefined($scope.countries.error) ) {
          console.log('Error connection to API (cookie expired), redirecting to login page');
          $location.path('/fe/user/login');
        }
    })
    .error(function (response) {
        console.log('Error connection to API (cookie expired), redirecting to login page');
        $location.path('/fe/user/login');
    })
  };

  // Get cities for a given country id from backend
  $scope.getCountryCities = function () {
    console.log('get cities request to backend, token is ' + $scope.auth_token);
    $http({
      url: 'http://localhost:8090/be/cities/cities',
      method: 'GET',
      params: {token: $scope.auth_token, country_id: $scope.selectedCountryId},
      headers: {'Content-Type': 'application/json'}
    })
        .success(function (nodeResponse) {
          console.log('countries get request is successful');
          $scope.countryCities = nodeResponse;
          console.log('citiesController countries are ' + JSON.stringify($scope.countries))
          if ( angular.isDefined($scope.countryCities.error) ) {
            console.log('Error connection to API (cookie expired), redirecting to login page');
            $location.path('/fe/user/login');
          }
        })
        .error(function (response) {
          console.log('Error: ' + JSON.stringify(response));
        })
  };

  // Here scope is populated with countries and cities data
  $scope.getCountries();

  // As country not selected yet, no cities are displayed
  $scope.countryCities = [];

  // Get cities for selected country
//  $scope.getCountryCities = function () {
//    console.log('getting cities for country id ' + $scope.selectedCountryId);
//    $scope.countryCities = [];
//    angular.forEach($scope.cities, function(value, key)  {
//      if ( value.country.id == $scope.selectedCountryId ) {
//          $scope.countryCities.push(value);
//      }
//    });
//  };

  $scope.submit = function() {
      console.log('Get city info button pressed');
      $cookies.put("poc.city_id", $scope.selectedCityId);
      $location.path('/fe/city');
  }

}]);


// Checking if a user is logged in, i.e. auth_token is present in cookie
// SHOULD BE MOVED TO SHARED!!!
var checkRouting = function ($q, $rootScope, $location, $http, $cookies) {
  console.log('location path is ' + $location.path());
  if ($cookies.get('auth_token') != null) {
    console.log('cookie exists! ' + $cookies.get('auth_token'));
  } else {
    console.log('cookie does not exist, redirecting to login page!');
    $rootScope.appReferrer = $location.path();
    $location.path("/fe/user/login");
  }
}