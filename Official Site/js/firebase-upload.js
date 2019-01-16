'use strict';
var databaseConnector = function () {

    var signInButtonG = document.getElementById('sign-in-button');
    var email = document.getElementById('sign-in-email');
    var password = document.getElementById('sign-in-pw');
    var splashPage = document.getElementById('page-splash');
    // var signOutButton = document.getElementById('sign-out-button');
    var submissionForm = document.getElementById('submissionForm');


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

    init();

    //Link all buttons to listen to clicks
    function init() {
        //added to bypass the admin
        // onAuthStateChanged(true);


        //Link sign in button to pprint proper errors
        signInButtonG.addEventListener('click', function () {

            firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {            // firebase.auth().signInWithPopup(provider)
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + " : " + errorMessage);
            }).then(function (userNew) {


            });
        });

        firebase.auth().onAuthStateChanged(onAuthStateChanged);


        submit.addEventListener('click', function () {
            addNewEvent();
        });

    }

    //Whenever a user's state changes ( aka, login / log-out)
    //Switch to display the proper things.
    function onAuthStateChanged(user) {

        //TODO: make sure that this is safe
        if (user) {

            splashPage.style.display = 'none';
            submissionForm.style.display = 'block';

        } else {

            splashPage.style.display = 'block';
            submissionForm.style.display = 'none';

        }
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

        var updates = {};
        updates['NewEvent/' + newEventKey] = eventData;

        if (firebase.auth().currentUser) {

            console.log("uploading :")
            console.log(eventData);

            firebase.database().ref().update(updates);
        } else {
            console.log("no user logged in")
        }
    }
}
