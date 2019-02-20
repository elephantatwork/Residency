'use strict';
//Divs which contain the lists of entries
var upcomingEventsSection = document.getElementById('upcomingEvents');
var pastEventsSection = document.getElementById('pastEvents');
//For which firebase dbs are we listening to
var listeningFirebaseRefs = [];
var pastEventsRef;
var upcomingEventsRef;
var unlockedPostsRef;

var unlockedTimingsRef;

//Used to identifiy user to track who posted event
var user = '';
var startPageSize = 100;
// var pageSize = 3;
// var pageNR = 0;

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var category = "UpcomingEvents";

//The last loaded entry, used for pagination
var lastKey;
var loadedKeys = [];
//A global dezipper reference
// var zip;

init();

function init() {

    //log user in as anonymus
    // firebase.auth().signInAnonymously().catch(function (error) {
    //     // Handle Errors here.
    //     var errorCode = error.code;
    //     var errorMessage = error.message;
    //     console.log(errorCode + " : " + errorMessage);
    // }).then(function () {

    //     //Get user
    //     user = JSON.parse(localStorage.getItem('user'));

    //     if (user != null) {
    //         console.log("grabbed " + user + " from localstorage");

    //         //Check if there is an id for a project if it's a url
    //         checkViewer(qs().view);

    //         //Start listening to changes in the settings
    //         checkSettings();


    //     } else {
    //         new Fingerprint2().get(function (result) {

    //             //start fetching the databases
    //             user = result;
    //             localStorage.setItem('user', JSON.stringify(user));

    //             //Check if there is an id for a project if it's a url
    //             checkViewer(qs().view);

    //             //Start listening to changes in the settings
    //             checkSettings();



    //         });
    //     }
    // });

    startDatabaseQueries(startPageSize, true);

    //Create a JSZIP to reference later
    // zip = new JSZip();
}


//Starts listenting for new posts
function startDatabaseQueries(loadItems) {
    //Get posts and assign callbacks to the server driven actions Added / Changed / Deleted
    var fetchPosts = function (postsRef, sectionElement, admin) {
        postsRef.on('child_added', function (data) {

            //We get one item too much from the server just don't do anything with that data
            // if (!loadedKeys.includes(data.key)) {

                // console.log(data.key);
                // var containerElement = sectionElement;

                console.log(sectionElement);

                //Save the entrykey for the next time we paginate
                // lastKey = data.key;
                // loadedKeys.push(data.key);

                

                var child = sectionElement.lastChild;//( loadedKeys > 1) ? containerElement.lastChild : containerElement.firstChild;

                var valuatedData = data.val();
                // console.log(valuatedData);
                // if (valuatedData.public)
                    insertAfter(createPostElement(user, data.key, valuatedData.title, valuatedData.description, valuatedData.tag, valuatedData.hostedby, valuatedData.location, valuatedData.date, valuatedData.timeto, valuatedData.timefrom, valuatedData.fblink),
                        child);
                //Add the element on top of all elements
                // containerElement.insertBefore(
                //     createPostElement(user, data.key, valuatedData.title, valuatedData.description, valuatedData.tag, valuatedData.hostedby, valuatedData.location, valuatedData.date, valuatedData.timeto, valuatedData.timefrom, valuatedData.fblink),
                //     child);
            // }
        });
        postsRef.on('child_changed', function (data) {
            //The only thing that can change is the star count when others vote for the object
            //sectionElement.querySelector("#" + data.key).getElementsByClassName('like-count')[0].innerText = data.val().likeCount;
            var valuatedData = data.val().contents;

            //people can change all aspects of post
            sectionElement.querySelector("#" + data.key);
            var postElement = sectionElement.querySelector("#" + data.key).getElementsByClassName('callout')[0];
            // Set values.
            console.log(postElement);

            postElement.getElementsByClassName('title')[0].innerText = valuatedData.title;// || 'Anonymous';
            postElement.getElementsByClassName('description')[0].innerText = valuatedData.description;
            postElement.getElementsByClassName('room')[0].innerText = valuatedData.room;
            postElement.getElementsByClassName('date')[0].innerText = valuatedData.date;
            postElement.getElementsByClassName('time-from')[0].innerText = valuatedData.timefrom;
            postElement.getElementsByClassName('time-to')[0].innerText = valuatedData.timeto;
            postElement.getElementsByClassName('time-from')[0].innerText = valuatedData.fblink;
        });
        postsRef.on('child_removed', function (data) {
            //Just delete the post 
            var post = sectionElement.querySelector("#" + data.key);
            post.parentElement.removeChild(post);
        });
    };

    //Grab only so many items 
    var queryUpcoming = firebase.database().ref("UpcomingEvents/");
    var queryPast = firebase.database().ref("PastEvents/");

    // unlockedPostsRef = query.endAt(null, lastKey).limitToLast(loadItems);//limitToFirst(loadItems);
    // console.log(category);

    // if (intial)    
    // unlockedPostsRef = query.orderByChild("unlockDate").limitToLast(loadItems);//limitToFirst(loadItems);

    upcomingEventsRef = queryUpcoming.orderByChild("date").limitToFirst(loadItems);//limitToFirst(loadItems);
    pastEventsRef = queryPast.orderByChild("date").limitToFirst(loadItems);//limitToFirst(loadItems);


    // Fetching and displaying all posts of each sections.


    fetchPosts(upcomingEventsRef, upcomingEventsSection, "UpcomingEvents" + "/");//""releasedPosts/");
    fetchPosts(pastEventsRef, pastEventsSection, "PastEvents" + "/");//""releasedPosts/");

    // Keep track of all Firebase refs we are listening to.
    listeningFirebaseRefs.push(upcomingEventsRef);
    listeningFirebaseRefs.push(pastEventsRef);

}

function insertAfter(newNode, referenceNode) {
    console.log( referenceNode);
    referenceNode.parentElement.insertBefore(newNode, referenceNode);
}

//Create a Cell
function createPostElement(user, postId, title, description, tag, host, room, date, timeto, timefrom, fblink) {

    // Create the DOM element from the HTML.
    var div = document.createElement('div');
    div.innerHTML = getStoreHTML(postId);
    var postElement = div.firstChild;

    // Set values.
    var titleDiv = postElement.getElementsByClassName('etitle')[0];
    titleDiv.innerHTML = '<a id="link">' + title + '</a>';// || 'Anonymous';

    postElement.getElementsByClassName('ehosted-by')[0].innerHTML = tag.fontcolor("#0064FF") + " " + host.fontcolor("#F06A98");
    postElement.getElementsByClassName('eroom')[0].innerHTML = "<br>" + room;

    var formatedDate = new Date(date);
    postElement.getElementsByClassName('edate')[0].innerHTML = formatedDate.getDate() + ". " + months[formatedDate.getMonth()] + " " + (timefrom + " ➪ " + timeto).fontcolor("#F06A98");
    // postElement.getElementsByClassName('etime-to')[0].innerText = timeto;
    // postElement.getElementsByClassName('etime-from')[0].innerText = timefrom;
    // postElement.getElementsByClassName('etag')[0].innerText = tag;

    postElement.getElementsByClassName('edescription')[0].innerText = description;

    var openDescription = function () {

        var description = postElement.getElementsByClassName("edescription")[0];
        var room = postElement.getElementsByClassName("eroom")[0];

        var newStyle = (description.style.display == "block") ? "none" : "block";

        description.style.display = newStyle;
        room.style.display = newStyle;

        //Add styling for title and background image
        if (newStyle == "block") {
            console.log(titleDiv);
            titleDiv.querySelector("#link").style.color = "white";
            titleDiv.style.backgroundColor =  "#0064FF";


        } else {
            titleDiv.querySelector("#link").style.color = "";
            titleDiv.style.backgroundColor = "";

        }
    }
    titleDiv.onclick = openDescription;

    var fblinkdiv = postElement.getElementsByClassName('efb-link')[0];//.innerHTML = "facebook";

    //Make sure there is an acutal fb event if not don't display the link
    if (fblink != "") {
        fblinkdiv.innerHTML = "facebook";

        fblinkdiv.setAttribute('href', fblink);
    } else {
        fblinkdiv.style.display = "none";
    }

    return postElement;
}

//Downloads the thumbnail from the firebase storage
// function getThumbnail(thumbnail, id) {

//     //Get a link to the firebase storage
//     var storageRef = firebase.storage().ref();

//     // Create a reference to the file we want to download
//     var entriesRef = storageRef.child("texture/p_" + id + '.jpg');

//     // Get the download URL
//     entriesRef.getDownloadURL().then(function (url) {

//         thumbnail.querySelector("#img").setAttribute('src', url);
//     });
// }

// //Update the like element @KAY CSS Shizzle
// function updateStarredByCurrentUser(postElement, starred) {
//     if (starred) {
//     } else {
//     }
// }

// //Update the like count of the postElement card text
// function updateStarCount(postElement, nbStart) {
//     postElement.getElementsByClassName('like-count')[0].innerText = nbStart;
// }

// //Do a transation and update the online like count
// function toggleLike(postRef, uid) {
//     console.log(uid);
//     postRef.transaction(function (post) {
//         if (post) {
//             if (post.likes && post.likes[uid]) {
//                 post.likeCount--;
//                 post.likes[uid] = null;
//             } else {
//                 post.likeCount++;
//                 if (!post.likes) {
//                     post.likes = {};
//                 }
//                 post.likes[uid] = true;
//             }
//         }
//         return post;
//     });
// }

//The cell html which gets filled with data from the server
function getStoreHTML(postID) {
    var html =
        '<div class="cell" id="' + postID + '" >' +
        '<div class="row">' +
        '<h1 class="col-12 etitle">EVENT</h1>' +
        '<div class="col-6 edate">DATUM</div>' +
        '<div class="col-6 ehosted-by">Organisiert von</div>' +
        '<div class="col-12 eroom">Raum 1</div>' +
        '<div class="col-12 edescription">Beschrieb</div>' +
        '<h3 class="col-12" style="text-align:center" ><a href="" class="efb-link" style="color:blue; font-size:20px;" target="_blank">Facebook Link</a></h3>' +
        '</div>' +
        '</div>'
    return html;
}
