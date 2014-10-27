'use strict';

angular.module('surplusApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('surplusPower', {
        url: '/surplusPower',
        templateUrl: 'app/surplusPower/surplusPower.html',
        controller: 'SurpluspowerCtrl'
      })
      .state('surplusPower check result', {
        url: '/surplusPower/:twitterId',
        templateUrl: 'app/surplusPower/surplusPower.html',
        controller: 'SurpluspowerCtrl'
      });
  });
