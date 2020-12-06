var contacts = [];
var lastTextSearch;
var lastResults = [];
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'keyoQim8DJWgWk7yV'}).base('appBUDK9ZR5YaC0SD');
findContacts = function (text, searchList) {
    var results = [];
    text = trimNumber(text);
    var needOrder = false;
    for (i = 0; i < searchList.length; i++) {
        if (text.length == 3 && isNaN(text) == false &&
            (searchList[i].phone == ("9" + text) || searchList[i].cellPhone.indexOf(("7950" + text)) > -1)) {
            searchList[i].star = 1;
            results.push(searchList[i]);
            needOrder = true;
        }
        else if (isNaN(text) == false &&
            (trimNumber(searchList[i].phone) + ' ' + (trimNumber(searchList[i].cellPhone))).indexOf(text) > -1) {
            searchList[i].star = 99;
            results.push(searchList[i]);
        }
        else {
            var uniqueName = "";
            var searchValueCollection = text.split(" ");
            var nameWithDelimeter = "$" + searchList[i].name.replace(" ", "$").replace(" ", "$") + "$";
            var findMatch = false;
            var findOneWordMatch = false;
            for (j = 0; j < searchValueCollection.length; j++) {
                findMatch = false;
                if (searchList[i].name.indexOf(searchValueCollection[j]) > -1) {
                    if (nameWithDelimeter.indexOf("$" + searchValueCollection[j] + "$") > -1) {
                        findOneWordMatch = true;
                    }
                    findMatch = true;
                }
                else
                    break;
            }
            if (findMatch == true && findOneWordMatch == true) {
                uniqueName = searchList[i].name;
                searchList[i].star = 0;
                results.push(searchList[i]);
            }

            var index = searchList[i].name.indexOf(text);
            if (index > -1 && searchList[i].name != uniqueName) {
                searchList[i].star = 0;
                results.push(searchList[i]);
            }
        }
    }
  if(needOrder == true)
        results.sort(function (a, b) { return a.star - b.star });
    lastResults = results;
    lastTextSearch = text;
    return results;
}

searchContacts = function (text) {
    return findContacts(text, contacts);
}

trimNumber = function (text) {
    if (isNaN(text.replace('-', '').trim()) == false) {
        return text.replace('-', '').trim();
    }
    return text;
}

clearResults = (function () {
    lastTextSearch = "";
    lastResults = [];
});

refreshContacts = (function () {
    /*$.getJSON("https://drive.google.com/uc?export=download&id=0BwLvmHSxsO9YbWJwZFl6SzkyUW8", function (data) {
        var localData = JSON.stringify(data);
        window.localStorage.setItem('addressBook', localData);
        contacts = convertContactsFromJson(data);
    }).error(function () {
        getContactsFromLocalStorage();
    });
    getContactsFromLocalStorage();*/
    
    //getContactsFromLocalStorage();
    var tmpcontacts = [];
	base('Imported table').select({
		view: "Grid view"
	}).eachPage(function page(records, fetchNextPage) {
		// This function (`page`) will get called for each page of records.

	    records.forEach(function (record) {
	        var cellPhone = record.get('CellPhone');
	        tmpcontacts.push(
                {
                    name: record.get('FullName'),
                    related: (record.get('Partner') ? record.get('Partner') : ""),
                    phone: (record.get('PhoneNumber') ? record.get('PhoneNumber') : ""),
                    cellPhone: (cellPhone ?
                        (cellPhone.indexOf('(') > -1 ? cellPhone.replace(")", "").replace("(", "").replace("-", "").replace(" ", "") : cellPhone) : ""),
                    email: (record.get('Email')?record.get('Email'):"")
                });
	    });

		// To fetch the next page of records, call `fetchNextPage`.
		// If there are more records, `page` will get called again.
		// If there are no more records, `done` will get called.
		window.setTimeout('',1000);
		fetchNextPage();

	}, function done(err) {
	     /*if (err) { 
            getContactsFromLocalStorage();
	        return;
	    }*/
				
	});
    if(tmpcontacts != null && tmpcontacts.length > 0)
    {
        contacts = tmpcontacts;
        var localData = JSON.stringify(contacts);
        window.localStorage.setItem('addressBook', localData);
    }
    else
        getContactsFromLocalStorage();

});
convertContactsFromJson = (function (jsonObject) {
    var tmpcontacts=[];
    for (var i = 0; i < jsonObject.Phones.length; i++) {
        var contact = jsonObject.Phones[i];
        tmpcontacts.push({ name: contact.name, related: contact.related, phone: contact.phone, cellPhone: contact.cellPhone, email: contact.email });
    }
    return tmpcontacts;
});
getContactsFromLocalStorage = (function () {
    var localData = JSON.parse(window.localStorage.getItem('addressBook'));
    if(localData != null)
        contacts = localData;
    //if (data != null)
        //contacts = convertContactsFromJson(data);
    /*var data = window.localStorage.getItem('addressBook');
    if(data != null)
        contacts = data;*/
});