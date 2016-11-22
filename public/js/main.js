var app = angular.module('LsKey', ['ui.bootstrap', 'ngRoute']);

app.config(function($routeProvider, $locationProvider){
  $routeProvider
      .when('/',{
        templateUrl : 'partials/login.html',
        controller : 'auth'
      })
      .when('/home',{
        templateUrl : 'partials/home.html',
        controller : 'home',
        caseInsensitiveMatch : true
      })
      // .otherwise() doesn't work in html5Mode!?

  $locationProvider.html5Mode(true);
});

app.controller('auth', function($scope, $http, $window, $location) {

  $scope.formData = {};
  $scope.blob = localStorage.getItem('blob');
  if($scope.blob)
    $http.defaults.headers.common['X-LsKey'] = $scope.blob;

  $scope.username = localStorage.getItem('username');
  if($scope.username)
    $http.defaults.headers.common['X-LsUser'] = $scope.username;

  $scope.submit = function() {
      $http({
        method: 'POST',
        url: '/api/register',
        data: {
          email : $scope.formData.email
        },
        responseType: 'json'
      }).then(function successCallback(res) {
        localStorage.setItem('blob', res.data.blob);
        localStorage.setItem('username', res.data.username);
        $location.path("/home");
      }, function errorCallback(err) {
        console.log(err);
      });
  }

  // hook changes.
  $window.addEventListener('storage', function(result) {
    if(result.key === 'blob'){
      $scope.blob = result.newValue;
      $http.defaults.headers.common['X-LsKey'] = $scope.blob;
      if(result.key === 'username'){
    }
      $scope.username = result.newValue;
      $http.defaults.headers.common['X-LsUser'] = $scope.username;
    }
  });

  $http({
      method: 'POST',
      url: '/api/home',
      responseType: 'json'
    }).then(function successCallback(response) {
        //console.log("success:",response);
        $location.path(response.redir);
      },function errorCallback(err) {
        //console.log("error:",err);
      });
});

app.controller('home', function($scope,$http,$location) {
  $scope.message = 'Welcome to LsKey!';

  $scope.logout = function(){
    localStorage.removeItem('blob');
    localStorage.removeItem('username');
    delete $http.defaults.headers.common['X-LsKey'];
    delete $http.defaults.headers.common['X-LsUser'];

    $location.path("/");
  }
});
