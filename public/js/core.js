var app = angular.module('keyworker-demo', ['ui.bootstrap']);

app.controller('auth', function($scope,$http) {

  // If we can't use webworkers then this is out.
  $scope.workerSupported = typeof(Worker) !== "undefined" ? true : false;
  $scope.formData = {};
  $scope.blob = localStorage.getItem('blob');
  if($scope.blob)
    $http.defaults.headers.common['X-LsKey'] = $scope.blob;

  $scope.submit = function() {
    if($scope.workerSupported){
      $http({
        method: 'POST',
        url: '/register',
        data: {
          email : $scope.formData.email
        }
      }).then(function successCallback(res) {
        console.log("adding data to localstorage: %s", res.data.blob);
        localStorage.setItem('blob', res.data.blob);
        window.location.href = res.data.redir;
      }, function errorCallback(res) {
        console.log(res);
      });
    }
  }

  // hook changes.
  window.addEventListener('storage', function(result) {
    if(result.key === 'blob'){
      $scope.blob = result.newValue;
      $http.defaults.headers.common['X-LsKey'] = $scope.blob;
    }
  });

  $scope.init = function() {
    $http({
      method: 'POST',
      url: '/'
    }).then(function successCallback(res) {
      window.location.href = res.data.redir;
    }, function errorCallback(res) {
      // console.log(res);
      // Do nothing.
    });
  }

});
