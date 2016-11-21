var app = angular.module('LsKey', ['ui.bootstrap']);

app.controller('home', function($scope) {

  $scope.logout = function(){
    localStorage.removeItem('blob');
    localStorage.removeItem('username');
    window.location.href = '/';
  }

});
