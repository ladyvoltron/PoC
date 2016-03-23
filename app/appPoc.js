'use strict';

// Declare app level module which depends on views, and components
var appPoc = angular.module('appPoc', [
  'ngRoute',
  'ngResource',
  'ngCookies',
  'appPoc.cities',
  'appPoc.city',
  'appPoc.login'
//  'pocApp.version'
]);

appPoc.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/fe/cities'});
}]);
