'use strict';

describe('Controller: SurpluspowerCtrl', function () {

  // load the controller's module
  beforeEach(module('surplusApp'));

  var SurpluspowerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SurpluspowerCtrl = $controller('SurpluspowerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
