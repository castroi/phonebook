(function () {
    'use strict';

    angular
        .module('app')
        .controller('about', about);

    about.$inject = ['$location', '$rootScope', 'deviceService'];

    function about($location, $rootScope, deviceService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'about';

        activate();

        function activate() {
            deviceService.defaultBackButtonHandler = undefined;
        }
    }
})();
