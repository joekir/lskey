var app = angular.module('LsKey', ['ui.bootstrap']);

app.controller('auth', function($scope,$http) {

  // If we can't use webworkers then this is out.
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
        url: '/register',
        data: {
          email : $scope.formData.email
        }
      }).then(function successCallback(res) {
        console.log("adding to localstorage blob : %s and username: %s"
                              ,res.data.blob, res.data.username);

        localStorage.setItem('blob', res.data.blob);
        localStorage.setItem('username', res.data.username);

        window.location.href = res.data.redir;
      }, function errorCallback(res) {
        console.log(res);
      });
  }

  // hook changes.
  window.addEventListener('storage', function(result) {
    if(result.key === 'blob'){
      $scope.blob = result.newValue;
      $http.defaults.headers.common['X-LsKey'] = $scope.blob;
    }
    if(result.key === 'username'){
      $scope.username = result.newValue;
      $http.defaults.headers.common['X-LsUser'] = $scope.username;
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
