'use strict';
var databaseConnector = function () {

    //Login page links
    var signInButtonG = document.getElementById('sign-in-button-Google');
    var email = document.getElementById('sign-in-email');
    var password = document.getElementById('sign-in-pw');
    var splashPage = document.getElementById('page-splash');
    var signOutButton = document.getElementById('sign-out-button');

    var form = document.getElementById('submissionform');
    var congratulation = document.getElementById('congratulation');

    var title_german = document.getElementById('title_german');
 //   var title_french = document.getElementById('title_french');
 //   var title_italian = document.getElementById('title_italian');
    var title_english = document.getElementById('title_english');

    var description_german = document.getElementById('description_german');
 //   var description_french = document.getElementById('description_french');
 //   var description_italian = document.getElementById('description_italian');
    var description_english = document.getElementById('description_english');

    var winItem_german = document.getElementById('winItem_german');
//    var winItem_french = document.getElementById('winItem_french');
//    var winItem_italian = document.getElementById('winItem_italian');
    var winItem_english = document.getElementById('winItem_english');

    var pushTitle_german = document.getElementById('pushTitle_german');
//    var pushTitle_french = document.getElementById('pushTitle_french');
//    var pushTitle_italian = document.getElementById('pushTitle_italian');
    var pushTitle_english = document.getElementById('pushTitle_english');

    var pushDesc_german = document.getElementById('pushDesc_german');
//    var pushDesc_french = document.getElementById('pushDesc_french');
//    var pushDesc_italian = document.getElementById('pushDesc_italian');
    var pushDesc_english = document.getElementById('pushDesc_english');

//    var winnerCode = document.getElementById("winner_code");

    var startdate = document.getElementById('start_date');
    var enddate = document.getElementById('end_date');

    var defaultValues = document.getElementById('debugDefaultValues');
    var submit = document.getElementById('submit');

    var devicesTemplate = {};

    //ugly
    var startNow;
    var endIn;
    var minutesUntilEnd = 5 * 60;

    init();

    //Link all buttons to listen to clicks
    function init() {

        //Initialize the form
        var today = new Date();
        var tomorrow = new Date(today.getTime() + 86400000); // 86'400'000 = 24h

        startdate.value = today.toDateInputValue();
        enddate.value = tomorrow.toDateInputValue();

        //Link sign in button to pprint proper errors
        // signInButtonG.addEventListener('click', function () {

        //     firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {            // firebase.auth().signInWithPopup(provider)
        //         // Handle Errors here.
        //         // var errorCode = error.code;
        //         // var errorMessage = error.message;
        //         console.log(errorCode + " : " + errorMessage);
        //     }).then(function (userNew) {

        //         // user = userNew;

        //     });
        // });

        // firebase.auth().onAuthStateChanged(onAuthStateChanged);
        //Added to bypass the admin
        onAuthStateChanged(true);

        submit.addEventListener('click', function () {

            lockForm();
            addNewCompetition();
        });

        defaultValues.addEventListener('click', function () {

            lockForm();
            debugAddDefaultValues();
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


    //Fills the competition with a startdate/enddate in the next 5 minutes
    function debugAddDefaultValues() {

        //get competition id
        firebase.database().ref().child('competitionID').once('value').then(function (snapshot) {

            var newPostKey = snapshot.val() + 1;

            title_german.value = "Titel" + "_nr_" + newPostKey;
//            title_french.value = "Titre" + "_nr_" + newPostKey;
//            title_italian.value = "Titelo" + "_nr_" + newPostKey;
            title_english.value = "Title" + "_nr_" + newPostKey;

            description_german.value = "Deutscher Beschrieb" + "_nr_" + newPostKey;
//            description_french.value = "Description francais" + "_nr_" + newPostKey;
//            description_italian.value = "Description italiano" + "_nr_" + newPostKey;
            description_english.value = "English description" + "_nr_" + newPostKey;

            winItem_german.value = "win deutsch" + "_nr_" + newPostKey;
//            winItem_french.value = "win francais" + "_nr_" + newPostKey;
//            winItem_italian.value = "win italiano" + "_nr_" + newPostKey;
            winItem_english.value = "win english" + "_nr_" + newPostKey;

            pushTitle_german.value = "PushTitle deutsch" + "_nr_" + newPostKey;
//            pushTitle_french.value = "PushTitle francais" + "_nr_" + newPostKey;
//            pushTitle_italian.value = "PushTitle italiano" + "_nr_" + newPostKey;
            pushTitle_english.value = "PushTitle english" + "_nr_" + newPostKey;

            pushDesc_german.value = "pushDesc deutsch" + "_nr_" + newPostKey;
//            pushDesc_french.value = "pushDesc francais" + "_nr_" + newPostKey;
//            pushDesc_italian.value = "pushDesc italiano" + "_nr_" + newPostKey;
            pushDesc_english.value = "pushDesc english" + "_nr_" + newPostKey;

//            winnerCode.value = "XXX666XXX_" + newPostKey;

            devicesTemplate = {
                // "device1": true,
                // "device2": true
            };

            startNow = new Date();
//            endIn = new Date(startNow.getTime() + minutesUntilEnd * 60000); // 86'400'000 = 24h

//            firebase.database().ref().update({ 'competitionID': newPostKey });

//            addNewCompetition();
            addNewPost();

        });

    }

    function lockForm() {
        // form.style.display = "none";
        // congratulation.style.display = "block";
    }

    function addNewPost() {

        var newPostKey = firebase.database().ref().child('NewPost').push().key;

        var postData = {
            contents: {
                title: {
                    german: title_german.value,
//                    french: title_french.value,
//                    italian: title_italian.value,
                    english: title_english.value,
                },
                description: {
                    german: description_german.value,
//                    french: description_french.value,
//                    italian: description_italian.value,
                    english: description_english.value,
                },
                winItem: {
                    german: winItem_german.value,
//                    french: winItem_french.value,
//                    italian: winItem_italian.value,
                    english: winItem_english.value,
                },
                push_title: {
                    german: pushTitle_german.value,
//                    french: pushTitle_french.value,
//                    italian: pushTitle_italian.value,
                    english: pushTitle_english.value,
                },
                push_desc: {
                    german: pushDesc_german.value,
//                    french: pushDesc_french.value,
//                    italian: pushDesc_italian.value,
                    english: pushDesc_english.value,
                }
            },
            devices: devicesTemplate,
            winner_code: winnerCode.value,
            start_date: (startNow != null) ? startNow.getTime() : startdate.valueAsNumber,
            end_date: (endIn != null) ? endIn.getTime() : enddate.valueAsNumber,
        }

        console.log(postData);

        var updates = {};
        updates['NewCompetition/' + newPostKey] = postData;

        firebase.database().ref().update(updates);

    }
}