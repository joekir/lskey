var app = angular.module('LsKey', ['ui.bootstrap']);

app.controller('home', function($scope) {

  $scope.logout = function(){
    localStorage.removeItem('blob');
    window.location.href = '/';
  }

});
