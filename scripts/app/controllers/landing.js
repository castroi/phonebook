(function () {
    'use strict';

    angular
        .module('app')
        .controller('landing', landing);

    landing.$inject = ['$location', '$rootScope', 'deviceService'];
    
    document.addEventListener('deviceready', function () {
        initLanding();
        $('#searchText').select();
    }, false);
    function landing($location, $rootScope, deviceService) {

        /* jshint validthis:true */
        var vm = this;
        vm.title = 'landing';
       
        activate();

        function activate() {
            deviceService.defaultBackButtonHandler = undefined;
        }
        console.log("LANDING");
        initLanding();
        $('#searchText').select();
    }
    
})();

function initLanding() {

    $('#searchText').keyup(getAndShowContacts);

    refreshContacts();
    $('#searchText').select();
}

function getAndShowContacts() {
    var text = $('#searchText').val();
    clearContactsList();
    if (text.length > 0) {
        var results = searchContacts(text);

        var html = "";
        for (var i = 0; i < results.length; i++) {
            if (i >= 30)
                break;
            html += showContact(results[i]);
        }
        $('#contactsList').append(html);
        AddEventToPhone();

        document.getElementById('myclear').addEventListener("click", function (event) {
            document.getElementById('searchText').focus();
        });

    }
    else
        clearResults();

}


function AddEventToPhone() {
    var aTags = document.getElementsByClassName("aPhone");
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener("click", function (event) {
            window.plugins.CallNumber.callNumber(onSuccess, onError, event.target.id, true);
        });
    }
    aTags = document.getElementsByClassName("aSMS");
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener("click", function (event) {
            window.location.href = "sms:" + event.target.id + "?body=";
        });
    }
    aTags = document.getElementsByClassName("aEmail");
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener("click", function (event) {
            window.location.href = "mailto:" + event.target.id;
        });
    }
    aTags = document.getElementsByClassName("aWhatsapp");
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener("click", function (event) {
            navigator.app.loadUrl("https://api.whatsapp.com/send?phone=972" + event.target.id.replace('+', '').replace('-', '') + "&text=", { openExternal: true });
        });
    }
    aTags = document.getElementsByClassName("aRelated");
    var aSearch = document.getElementById("searchText");
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener("click", function (event) {
            aSearch.value = event.target.text;
            clearResults();
            getAndShowContacts();
        });
    }
    aTags = document.getElementsByClassName("aShare");
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].addEventListener("click", function (event) {
            var text = event.target.id;

            var options = {
                message: text,
                chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
            }

            var onSuccess = function (result) {
                console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
                console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
            }

            var onError = function (msg) {
                console.log("Sharing failed with message: " + msg);
            }

            window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
        });
    }
}