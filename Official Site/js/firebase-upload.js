'use strict';
var databaseConnector = function () {

    var signInButtonG = document.getElementById('sign-in-button-Google');
    var email = document.getElementById('sign-in-email');
    var password = document.getElementById('sign-in-pw');
    var splashPage = document.getElementById('page-splash');
    var signOutButton = document.getElementById('sign-out-button');
    
    var eventCreation = document.getElementById('event-creation');

    var title = document.getElementById('event-title');
    var date = document.getElementById('date');
    var timefrom = document.getElementById('time-from');
    var timeto = document.getElementById('time-to');
    var location = document.getElementById('location');
    var hostedby = document.getElementById('hosted-by');
    var tag = document.getElementById('tag');
    var description = document.getElementById('description');
    var fblink = document.getElementById('fb-link');

    var submit = document.getElementById('submit');

    var devicesTemplate = {};

    init();

    //Link all buttons to listen to clicks
    function init() {
        //added to bypass the admin
        onAuthStateChanged(true);

        submit.addEventListener('click', function() {
            lockForm();
            addNewEvent();
        });

    }

    //Whenever a user's state changes ( aka, login / log-out)
    //Switch to display the proper things.
    function onAuthStateChanged(user) {

        //TODO: make sure that this is safe
        if (user) {

            splashPage.style.display = 'none';
            //submissionForm.style.display = 'block';

        } else {

            splashPage.style.display = 'block';
            //submissionForm.style.display = 'none';

        }
    }

    function lockForm() {
        //? everything commented out in other file
    }

    function addNewEvent() {
        var newEventKey = firebase.database().ref().child('NewEvent').push().key;

        var eventData = {
            contents: {
                title: title.value,
                date: date.value,
                timefrom: timefrom.value,
                timeto: timeto.value,
                location: location.value,
                hostedby: hostedby.value,  
                tag: tag.value,
                description: description.value,
                fblink: fblink.value
                }
            }

        console.log(eventData);

        var updates = {};
        updates['NewEvent/' + newEventKey] = eventData;

        firebase.database().ref().update(updates);

        eventCreation
    }
}
