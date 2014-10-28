'use strict';

angular.module('surplusApp')
  .controller('SurpluspowerCtrl', function ($scope, $stateParams, $http, $sce, Auth) {
    $scope.isCheckedSurplusPower = false;
    $scope.surplusPower = null;
    $scope.surplusText = null;
    $scope.user = Auth.getCurrentUser();

    $scope.authenticated = $scope.user && $scope.user.twitter !== undefined;

    var RadarChart = window.RadarChart;
    if(RadarChart !== undefined){
      RadarChart.defaultConfig.maxValue = 100;
      RadarChart.defaultConfig.w = 300;
      RadarChart.defaultConfig.h = 300;
    }

    $scope.init = function(){
      if($stateParams.twitterId){
        $scope.loadSurplusPower($stateParams.twitterId);
      }else if($scope.authenticated){
        $scope.loadSurplusPower($scope.user.twitter.id);
      }
    };

    $scope.redirectLogin = function(){
      location.href = '/auth/twitter';
    };

    $scope.checkSurplusPower = function(){
      if(!$scope.authenticated){
        window.location.href = '/auth/twitter';
      }else{
        $http
          .post('/api/surplus-powers')
          .success(function(surplusPower){
            $scope.surplusPower = surplusPower;
            $scope.renderingChart();
          });
      }
    };

    $scope.loadedUserTwitterId = null;
    $scope.loadSurplusPower = function(twitterId){
      $http
        .get('/api/surplus-powers/' + twitterId)
        .success(function(surplusPower){
          $scope.loadedUserTwitterId = twitterId;
          $scope.surplusPower = surplusPower;
          $scope.profileImageUrl = surplusPower.profileImageUrl;
          $scope.renderingChart();
        });
    };


    $scope.generateSurplusPlainText = function(){
      var text = $scope.surplusPower.name + ' 님의 잉여력은 ';
      var surplusPower = $scope.surplusPower.surplusPower;
      for(var key in surplusPower){
        text = text + key + ' ' + surplusPower[key] + ', ';
      }
      text = text.substring(0, text.length - 2);
      text = text + '입니다.';
      return text;
    };

    $scope.renderingChart = function(){
      var surplusPower = $scope.surplusPower.surplusPower;
      var data = [];
      $scope.surplusText = '<strong>' +  $scope.surplusPower.name + '</strong> 님의 잉여력은 ';
      for(var key in surplusPower){
        data.push({
          axis: key,
          value: surplusPower[key]
        });

        $scope.surplusText = $scope.surplusText + '<span class="label label-info">' + key + '</span> ' +
        '<strong>' + surplusPower[key] + '</strong>, ';
      }

      $scope.surplusText = $scope.surplusText.substring(0, $scope.surplusText.length - 2);
      $scope.surplusText = $scope.surplusText + '입니다.';

      $scope.surplusText = $sce.trustAsHtml($scope.surplusText);
      var chartData = [
        {
          axes: data
        }
      ];
      RadarChart.draw('#radar-chart', chartData);

      $scope.isCheckedSurplusPower = true;
    };

    $scope.isMyResult = function(){
      return $scope.user && $scope.user.twitter.id === parseInt($scope.loadedUserTwitterId, 10);

    };

    $scope.shareTwitter = function(){
      $http
        .post('/api/surplus-powers/share')
        .success(function(){
          alert('공유되었습니다.');
        });
    };
  });
