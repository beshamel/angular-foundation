angular.module("mm.foundation.offcanvas", [])
    .directive('offCanvasWrap', ['$window', function ($window) {
        return {
            scope: {},
            restrict: 'C',
            link: function ($scope, element, attrs) {
                var win = angular.element($window);
                var sidebar = $scope.sidebar = element;

                $scope.hide = function () {
                    sidebar.removeClass('move-left');
                    sidebar.removeClass('move-right');
                };

                win.bind("resize.body", $scope.hide);

                $scope.$on('$destroy', function() {
                    win.unbind("resize.body", $scope.hide);
                });
            },
            controller: ['$scope', function($scope) {

                this.leftClose = function() {
                  $scope.sidebar.removeClass("move-right");
                };

                this.leftOpen = function() {
                  $scope.sidebar.removeClass("move-left");
                  $scope.sidebar.addClass("move-right");
                };

                this.leftToggle = function() {
                    $scope.sidebar.removeClass("move-left");
                    $scope.sidebar.toggleClass("move-right");
                };

                this.rightClose = function() {
                    $scope.sidebar.removeClass("move-left");
                };

                this.rightOpen = function() {
                    $scope.sidebar.removeClass("move-right");
                    $scope.sidebar.addClass("move-left");
                };

                this.rightToggle = function() {
                    $scope.sidebar.removeClass("move-right");
                    $scope.sidebar.toggleClass("move-left");
                };

                this.hide = function() {
                    $scope.hide();
                };

                $scope.$on('offCanvas.leftOpen', this.leftOpen);
                $scope.$on('offCanvas.leftClose', this.leftClose);
                $scope.$on('offCanvas.leftToggle', this.leftToggle);
                $scope.$on('offCanvas.rightOpen', this.rightOpen);
                $scope.$on('offCanvas.rightClose', this.rightClose);
                $scope.$on('offCanvas.rightToggle', this.rightToggle);
                $scope.$on('offCanvas.hide', this.hide);
            }]
        };
    }])
    .directive('leftOffCanvasToggle', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
                element.on('click', function () {
                    $rootScope.$broadcast('offCanvas.leftToggle');
                });
            }
        };
    }])
    .directive('rightOffCanvasToggle', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
                element.on('click', function () {
                  $rootScope.$broadcast('offCanvas.rightToggle');
                });
            }
        };
    }])
    .directive('exitOffCanvas', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
                element.on('click', function () {
                  $rootScope.$broadcast('offCanvas.hide');
                });
            }
        };
    }])
    .directive('offCanvasList', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'C',
            link: function ($scope, element, attrs) {
                element.find('li').on('click', function (e) {
                    e.stopPropagation();
                    if (angular.element(this).hasClass('has-submenu')) {
                        angular.element(this.getElementsByClassName('left-submenu')[0]).addClass('move-right');
                        angular.element(this.getElementsByClassName('right-submenu')[0]).addClass('move-left');
                    } else if (angular.element(this).hasClass('back')) {
                        angular.element(this.parentElement).removeClass('move-right');
                        angular.element(this.parentElement).removeClass('move-left');
                    } else {
                      $rootScope.$broadcast('offCanvas.hide');
                    }
                });
            }
        };
    }]);
