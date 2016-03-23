'use strict';

var login = angular.module('appPoc.login', [
  'ngRoute'
]);

// ===== Routing =====
login.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fe/user/login', {
    templateUrl: 'modules/user/login.html',
    controller: 'loginController',
  resolve: {
      factory: checkRouting
  }
})
  .otherwise({redirectTo: '/fe/user/login'});
}]);

// ===== Controller for login page =====
login.controller('loginController', [
    '$rootScope',
    '$scope',
    '$http',
    '$location',
    '$cookies',
    function($rootScope, $scope, $http, $location, $cookies) {
        console.log('Hi, I am loginController');
        $scope.loginData={};
        $scope.nodeResponse={};
        $scope.errMsg = '';

        // Set cookie with authentication token
        // SHALL BE IN SHARED!!!
        $scope.writeCookie = function () {
            $cookies.put("poc.auth_token", $scope.nodeResponse.auth_token);
            console.log('cookie is set ' + $scope.nodeResponse.auth_token);
        };

        // TODO: make it working!
        console.log('rootScope.appReferer ' + $rootScope.appReferrer);
        $scope.appReferrer = $rootScope.appReferrer;

        // Request to API to get authentication token
        $scope.submit = function() {
            $http({
            url: 'http://localhost:8090/be/login',
            method: 'POST',
            data: $scope.loginData,
            headers: {'Content-Type': 'application/json'}
        })
        .success( function (nodeResponse) {
              $scope.nodeResponse = nodeResponse;
              console.log('-->  nodeResponse.statusCode = ' +  $scope.nodeResponse.statusCode );
              if ( $scope.nodeResponse.statusCode == '200') {
                $scope.writeCookie();
                console.log('cookie is set ' + $scope.nodeResponse.auth_token);
                console.log('login ok, redirect to city select page');
                $location.path("/fe/city/select");
              }
            else {
                  $scope.errMsg = "Login error!"
              }
        })
        .error(function (response) {
            console.log('Error: ' + JSON.stringify(response));
        })
      }
    }]);


var checkRouting = function ($q, $rootScope, $location, $http, $cookies) {
    console.log('location path is ' + $location.path());
    if ($cookies.get('poc.auth_token') != null) {
        console.log('cookie exists! ' + $cookies.get('poc.auth_token'));
        $location.path("/fe/cities");
//        return true;
    } else {
        console.log('cookie does not exist, redirecting to login page!');
        $rootScope.appReferrer = $location.path();
        $location.path("/fe/user/login");
    }
};