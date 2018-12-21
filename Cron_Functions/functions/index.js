var functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

//Starts a competition and puts it from 
// NewCompetition to ActiveCompetition
exports.comp_start =
  functions.pubsub.topic('start').onPublish((event) => {

    const ref = admin.database().ref('NewCompetition/');
    const now = Date.now();
    return ref.orderByChild('start_date').limitToFirst(1).once('value', (snapshot) => {

      var snap = snapshot.val();
      var key;

      console.log(snap);

      if (snap != null) {

        snapshot.forEach(function (childSnapshot) {
          key = childSnapshot.key;
        });
        console.log(key);


        var startDate = snapshot.child(key + "/start_date").val();

        if (startDate < now) {

          admin.database().ref('ActiveCompetition/').set(snap);

          //Delete from NewCompetition
          const updates = {};
          snapshot.forEach(child => {
            updates[child.key] = null;
          });

          // execute all updates in one go and return the result to end the function
          return ref.update(updates);
        } else {
          // console.log("comp starts later");
        }
      }
    });
  });

exports.comp_end =
  functions.pubsub.topic('end').onPublish((event) => {

    const ref = admin.database().ref('ActiveCompetition/');
    const now = Date.now();

    return ref.once('value', (snapshot) => {

      var snap = snapshot.val();
      var key;

      snapshot.forEach(function (childSnapshot) {
        key = childSnapshot.key;
        // console.log(ch)
      });

      var endDate = snapshot.child(key + "/end_date").val();
      if (endDate < now) {

        var timeSinceEnded = new Date(now - endDate);
        console.log("Competition ended " + timeSinceEnded + "ago.");

        //Get alldevices
        var devices = snapshot.child(key + "/devices");
        var rndDevice = Math.floor(Math.random() * devices.numChildren());
        var i = 0;
        var winKey = "";
        devices.forEach(function (devicesSnap) {
          if (rndDevice == i) {
            winKey = devicesSnap.key;

          }
          i++;
        });

        console.log("competition won by: " + winKey);

        //update
        var endRef = admin.database().ref('EndedCompetition/');
        endRef.update(snap);
        endRef.child(key + "/").update({ "winner_device": winKey });


        // Delete from ActiveCompetition
        const updates = {};
        snapshot.forEach(child => {
          updates[child.key] = null;
        });

        // execute all updates in one go and return the result to end the function
        return ref.update(updates);
      } else {
        // var timeUntilEnd = new Date(endDate - now);

        // console.log("Competition ends in " + timeUntilEnd);
      }
    });
  });

exports.sendNotification = functions.database.ref('/ActiveCompetition')
  .onCreate((snapshot, context) => {

    snapshot.forEach(function (childSnapshot) {
      key = childSnapshot.key;
    });


    var languages = ["german", "french", "italian", "english"];

    for (var i = 0; i < languages.length; i++) {
      // console.log(snapshot.val());
      var title = snapshot.child(key + "/contents/push_title/" + languages[i]).val();
      var description = snapshot.child(key + "/contents/push_desc/" + languages[i]).val();
      var language = "global_" + languages[i];

      payload = {
        topic: language,
        notification: {
          title: title,
          body: description,// + message.winner_code,
          // icon: receiver.photoURL
        },
        // "data": {
        //   "title": title,
        //   "body": description,
        // }


      };

      admin.messaging().send(payload)
        .then(function (response) {
          console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
          console.log("Error sending message:", error);
        });

    }

    return true;
  });