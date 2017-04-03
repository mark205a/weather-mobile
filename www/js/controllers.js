angular.module('app.controllers', [])

  .controller('pageCtrl', function ($scope, $http, $cordovaGeolocation, $ionicLoading, $ionicPopup) {
    var apiKey = 'eff0d36340f2f0a69d7bac149e489658'
    var posOptions = {
      timeout: 10000,
      enableHighAccuracy: false
    };
    $scope.weatherData = {}
    $scope.weatherContainer = false
    $scope.icon = ''
    $ionicLoading.show({
      template: 'Getting location...',
    }).then(function () {
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          $http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&APPID=${apiKey}&units=metric`).then(function (response) {
            console.log(response.data)
            var weatherResponse = response.data
            $scope.weatherContainer = true
            $ionicLoading.hide()
            $scope.weatherData = weatherResponse
            if (weatherResponse.weather[0].description === 'clear sky') {
              $scope.icon = 'ion-ios-sunny'
            } else if (weatherResponse.weather[0].description === 'few clouds') {
              $scope.icon = 'ion-ios-partlysunny'
            } else if (weatherResponse.weather[0].description === 'scattered clouds') {
              $scope.icon = 'ion-ios-cloud'
            } else if (weatherResponse.weather[0].description === 'broken clouds') {
              $scope.icon = 'ion-ios-cloud'
            } else if (weatherResponse.weather[0].description === 'shower rain') {
              $scope.icon = 'ion-ios-rainy'
            } else if (weatherResponse.weather[0].description === 'rain') {
              $scope.icon = 'ion-ios-rainy'
            } else if (weatherResponse.weather[0].description === 'thunderstorm') {
              $scope.icon = 'ion-ios-thunderstorm'
            } else if (weatherResponse.weather[0].description === 'snow') {
              $scope.icon = 'ion-ios-snowy'
            }
            document.addEventListener('deviceready', function () {
              TTS
                .speak({
                  text: `The temperature is ${weatherResponse.main.temp} degrees celsius.`,
                  locale: 'en-GB',
                  rate: 0.75
                }, function () {
                  console.log('success TTS')
                }, function (reason) {
                  console.log('Error in TTS', reason)
                });
            }, false);
          }, function (error) {
            $ionicLoading.hide()
            $ionicPopup.alert({
              title: 'Error',
              template: 'Please check your internet connection.'
            }).then(function () {
              ionic.Platform.exitApp();
            });
          })
        }, function (geolocationError) {
          $ionicLoading.hide()
          $ionicPopup.alert({
            title: 'Error',
            template: 'Please turn on Geolocation.'
          }).then(function () {
            ionic.Platform.exitApp();
          });
        });
    }, function (loadError) {
      $ionicLoading.hide()
      $ionicPopup.alert({
        title: 'Error',
        template: 'Please turn on Geolocation.'
      }).then(function () {
        ionic.Platform.exitApp();
      });
    });
  })

