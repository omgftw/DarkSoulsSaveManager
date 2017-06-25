(function () {
    'use strict';

    var _templateBase = './app/';

    angular.module('app', [
        'ngRoute',
        'ngMaterial',
        'ngAnimate',
        'ngMessages'
    ])
        .config(['$routeProvider', '$mdThemingProvider', function ($routeProvider, $mdThemingProvider) {
            $routeProvider.when('/', {
                templateUrl: _templateBase + 'welcome/welcome.html',
                controller: 'welcomeController',
                controllerAs: 'vm'
            });

            $routeProvider.when('/main', {
                templateUrl: _templateBase + 'main/main.html',
                controller: 'mainController',
                controllerAs: 'vm'
            });

            $routeProvider.when('/settings', {
                templateUrl: _templateBase + 'settings/settings.html',
                controller: 'settingsController',
                controllerAs: 'vm'
            });

            $routeProvider.otherwise({ redirectTo: '/' });

            $mdThemingProvider.theme('default')
                .primaryPalette("blue")
                .accentPalette("red")
                .warnPalette("red")
                .dark();
        }
        ]);

})();