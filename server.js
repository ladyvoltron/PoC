/**
 * Created by Olga Danilova on 16-3-2016.
 */

// ===== Set up ============================
var express = require('express');
var bodyParser = require('body-parser');
var apiRequest = require('request');
//var _ = require('underscore');

var app = express();
//var http = require('http');
var baseUrl = 'http://92.70.199.131:27961/rentbuddyapi/api';
//var baseUrl = 'http://92.70.199.131:27961/rentbuddyapi/api/tokens?&username=olga&password=olgA.rent1&database=Test&language=english&minutes=1000'
var dbname = 'Test';
var dblang = 'english';
var dbtime = '1000';

// ===== Configuration =====================
//app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader("Access-Control-Allow-Methods", "POST, GET");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    return next();
});

// ===== Routing =====

// ===== Login / getting authentication token
// ===== All views
app.post('/be/login', function(request, response) {
    var name     = request.body.name;
    var password = request.body.password;
//    console.log('user data ' + name + ' ' + password);
    var auth_token = '';
    var fullUrl = baseUrl + '/tokens?' + 'database=' + dbname + '&language=' + dblang + '&minutes=' + dbtime
        + '&username=' + name + '&password=' + password;
    console.log('request URL ' + fullUrl);

    apiRequest(fullUrl, function(apiError, apiResponse, body) {
        console.log('API response status code: ' + apiResponse.statusCode );
        if (apiResponse.statusCode == '200') {
            auth_token = body.replace(/"/g, '');
            console.log('auth_token is ' + auth_token);
        }
        else {
            console.log(apiResponse.statusCode);
        };

        response.setHeader('Content-Type', 'application/json');
//        console.log(JSON.stringify('{auth_token : ' + auth_token + ', statusCode : ' + apiResponse.statusCode + '}'));
        response.end(JSON.stringify({"auth_token" : auth_token, "statusCode" : apiResponse.statusCode}));
    });
});


// ===== Getting all countries
// ===== View: cities
app.get('/be/cities/countries', function(request, response) {
    var auth_token = request.param('token');
    console.log('token received is ' + auth_token);

    var fullUrl = baseUrl + '/country?properties=id,name&token=' + auth_token;
    console.log('request URL ' + fullUrl);
    var apiData = {};
    var statusCode = '';

    apiRequest(fullUrl, function(apiError, apiResponse, body) {
        console.log('API response status code: ' + apiResponse.statusCode );
        statusCode = apiResponse.statusCode;
        if (apiResponse.statusCode == '200') {
            console.log('request to API is ok');
            apiData = JSON.parse(body);
        }
        else {
            console.log('request to API is failed, error code ' + apiResponse.statusCode);
            apiData = { error: apiResponse.statusCode };
        };

        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(apiData));
    });
});


// ===== Getting all cities for a given country
// ===== View: cities
app.get('/be/cities/cities', function(request, response) {
    var auth_token = request.param('token');
    var country_id = request.param('country_id');
    console.log('token received is ' + auth_token);
    var fullUrl = baseUrl + '/city?properties=id,name,country(id.eq.' + country_id + ')&token=' + auth_token;
    console.log('request URL ' + fullUrl);
    var statusCode = '';

    apiRequest(fullUrl, function(apiError, apiResponse, body) {
        console.log('API response status code: ' + apiResponse.statusCode );
        statusCode = apiResponse.statusCode;
        if (apiResponse.statusCode == '200') {
            console.log('request to API is ok');
            apiData =  JSON.parse(body);
        }
        else {
            console.log('request to API is failed, error code ' + apiResponse.statusCode);
            apiData = { error: apiResponse.statusCode };
        };

//        var data = JSON.parse(apiData);
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(apiData));
    });
});


// ===== Getting detailed information for a given city
// ===== View: city
app.get('/be/city/info', function(request, response) {
    var auth_token = request.param('token');
    var city_id    = request.param('city_id');
    console.log('token received is ' + auth_token);
    var fullUrl = baseUrl + '/city?properties=id.eq.' + city_id + ',name,country(name),region(name),areaCode&token=' + auth_token;
    console.log('request URL ' + fullUrl);
    var statusCode = '';

    apiRequest(fullUrl, function(apiError, apiResponse, body) {
        console.log('API response status code: ' + apiResponse.statusCode );
        statusCode = apiResponse.statusCode;
        if (apiResponse.statusCode == '200') {
            console.log('request to API is ok');
            apiData =  JSON.parse(body);
        }
        else {
            console.log('request to API is failed, error code ' + apiResponse.statusCode);
            apiData = { error: apiResponse.statusCode };
        };

        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(apiData));
    });
});


// ===== Listener =====
app.listen(8090);
console.log("App listening on port 8090");

