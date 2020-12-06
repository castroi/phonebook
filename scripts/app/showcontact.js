
function onSuccess(result) {
    //$('#serachText').focus();
}

function onError(result) {
    //$('#serachText').focus();
}

showContact = (function (contact) {
    var message = "{{name}}";
    if (contact.phone != "" && contact.phone != undefined) {
        message += "\r\n{{phone}}";
    }
    if (contact.cellPhone != "" && contact.cellPhone != undefined) {
        message += "\r\n{{cellPhone}}";
    }
    if (contact.email != "" && contact.email != undefined) {
        message += "\r\n{{email}}";
    }

    var template = "<li class='list-group-item'>" +
                    "<div class='row'>" +
                        "<h1><div class='col-xs-10'>{{name}}</div></h1><h2><a><div id='"+message+"' class='aShare col-xs-2 fa fa-share-alt fa-sm'></div></a></h2>";
                        if (contact.related != "" && contact.related != undefined) {
                            template += "<h3><div class='col-xs-12'><a class='aRelated'>{{related}}</a></div></h3>";
                        }
                template += "</div>" +
                    "<h2>";
                        if (contact.phone != "" && contact.phone != undefined) {
                            template +=
                            "<div class='row text-left'>" +
                                "<a class='aPhone' ><div>" +
                                   "<span id='{{phone}}' class='col-xs-8'>{{phone}}</span><span id='{{phone}}' class='col-xs-2 fa fa-phone'></span></div>" +
                                "</div></a>" +
                            "</div>";
                    }
                        if (contact.cellPhone != "" && contact.cellPhone != undefined) { 
                        template += 
                        "<div class='row text-left'>" +
                            "<a><div class='aPhone'>" +
                               "<span id='{{cellPhone}}' class='col-xs-8'>{{cellPhone}}</span></span></div></a>" +
                            "<a><span id='{{cellPhone}}' class='col-xs-2 aWhatsapp fa fa-whatsapp'></span></a>" +
                            "<a><div><span id='{{cellPhone}}' class='col-xs-2 aSMS glyphicon glyphicon-comment'></span>" +
                            "</div></a>"+
                        "</div>";
                    }
                        if (contact.email != "" && contact.email != undefined) {
                        template +=
                        "<div class='row text-left'>" +
                            "<div class='col-xs-11'>" +
                                "<a><div id='{{email}}' class='aEmail'>{{email}}</div></a>" +
                            "</div>" +
                        "</div>";
                    }
                    template += "</h2>" +
                "</li>";
    return Mustache.to_html(template, contact);
});
clearContactsList = (function () {
    $('#contactsList').html('');
});


AddClicks = (function(){
    $('.aPhone').click(function () {
        window.plugins.CallNumber.callNumber(onSuccess, onError, $(this).id, true);
    });
    $('.aSMS').click(function () {
        window.location.href = "sms:" + $(this).id + "?body=";
    });
    $('.aShare').click(function () {
        //window.socialmessage.send("idan castro");
        window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    });
    $('.aWhatsapp').click(function () {
        window.location.href = "sms:" + $(this).id + "?body=";
      //  window.location.href = "https://api.whatsapp.com/send?phone=" + $(this).id.replace('+','').replace('-','') + "&text=";
    });
});


var onSuccess = function (result) {
    // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
}

var onError = function (msg) {
    
}



