(function () {
    'use strict';

    angular
        .module('app')
        .controller('settings', settings);

    settings.$inject = ['$location', '$rootScope', 'deviceService', 'modalService'];

    function settings($location, $rootScope, deviceService, modalService) {
        /* jshint validthis:true */
        var vm = this;
        /**
         * Toggles geolocation enable on device
         */
        function toggleGeoLocationEnabled() {
            if (deviceService.geoLocationEnabled === "false") {
                modalService.showModal(function (option) {
                    if (option == modalService.YES) {
                        deviceService.toggleGeoLocationEnabled();
                    }
                },
                    {
                        buttons: modalService.YES | modalService.NO,
                        defaultOption: modalService.NO,
                        message: 'Let this application access your location?',
                        title: 'Consent Required'
                    });
            }
            else
                deviceService.toggleGeoLocationEnabled();
        }
        vm.toggleGeoLocationEnabled = toggleGeoLocationEnabled;
        /**
         * Gets geolocation is enabled on the device
         */
        Object.defineProperty(vm, 'geoLocationEnabled', {
            get: function () {
                return deviceService.geoLocationEnabled === 'true';
            },
            set: function (value) {
                vm.toggleGeoLocationEnabled();
            }
        });
        activate();
        function activate() {
            deviceService.defaultBackButtonHandler = onDeviceBackButton;
        }
        function onDeviceBackButton(args) {
            console.log($location.path());
            window.location = "#/";
            console.log($location.path());
        }
    }
})();
