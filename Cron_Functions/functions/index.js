var functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.dayOver =
  functions.pubsub.topic('dayOver').onPublish((event) => {


    const ref = admin.database().ref('UpcomingEvents/');
    const now = Date.now();

    return ref.once('value', (snapshot) => {

      //Dictionary for all changed entries
      const updates = {};

      //Go though all released posts
      snapshot.forEach(function (childSnapshot) {

        var key = childSnapshot.key;
        var snap = childSnapshot.val();

        //Calculate the end date with the post's unlock date
        var endDate = new Date(childSnapshot.child("/date").val()).getTime();
        var hours = childSnapshot.child("/timeto").val().split(":");
        var hoursMs = (+hours[0] * (60000 * 60)) + (+hours[1] * 60000);
// console.log((+timeParts[0] * (60000 * 60)) + (+timeParts[1] * 60000));
        // console.log(new Date(endDate+hoursMs));
        // console.log(endDate + hoursMs);
        // console.log(now);

        //If the date plus the retireDelay already happened put the post into the finalPost category
        if ((endDate+hoursMs) < now) {

          updates['/PastEvents/' + key] = childSnapshot.val();

          admin.database().ref().update(updates);

          if (ref.child(key)) {
            console.log("Remove key" + key);
            ref.child(key).remove();
          }
        }
      
      });
    });




    // return ref.once('value', (snapshot) => {

    //   var snap = snapshot.val();
    //   var key;

    //   snapshot.forEach(function (childSnapshot) {
    //     key = childSnapshot.key;

    //     var endDate = new Date(snapshot.child(key + "/date").val()).getTime();

    //     if (endDate < now) {

    //       console.log(childSnapshot);

    //       var timeSinceEnded = new Date(now - endDate);
    //       console.log("Event ended " + timeSinceEnded + "ago.");

    //       //update
    //       var endRef = admin.database().ref('PastEvents/');
    //       endRef.update(childSnapshot);

    //       // Delete from ActiveCompetition
    //       // const updates = {};
    //       // snapshot.forEach(child => {
    //       //   updates[child.key] = null;
    //       // });

    //       // return ref.update(updates);
    //     }
    //   });
    // });
  });