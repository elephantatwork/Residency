'use strict';
//Div's which contain the lists of entries
var unlockedPostsSection = document.getElementById('posts');

//For which firebase dbs are we listening to
var listeningFirebaseRefs = [];
var unlockedPostsRef;
var unlockedTimingsRef;

//Used for identifiy one user that then only can vote once!
var user = '';
var startPageSize = 6;
var pageSize = 3;
var pageNR = 0;

var category = "releasedPosts"; // "finalPosts"
var votingOver = false;

//The last loaded entry, used for pagination
var lastKey;
var loadedKeys = [];
//A global dezipper reference
var zip;

init();

function init() {

    //log user in as anonymus
    firebase.auth().signInAnonymously().catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " : " + errorMessage);
    }).then(function () {

        //Get user
        user = JSON.parse(localStorage.getItem('user'));

        if (user != null) {
            console.log("grabbed " + user + " from localstorage");

            //Check if there is a id for a project if it's an url
            checkViewer(qs().view);

            //Start listening to changes in the settings
            checkSettings();


        } else {
            new Fingerprint2().get(function (result) {

                //start fetching the databases
                user = result;
                localStorage.setItem('user', JSON.stringify(user));

                //Check if there is a id for a project if it's an url
                checkViewer(qs().view);

                //Start listening to changes in the settings
                checkSettings();



            });
        }

        // //Check if there is a id for a project if it's an url
        // checkViewer(qs().view);

        // //Start listening to changes in the settings
        // checkSettings();

        // //Start grabbing entries 
        // startDatabaseQueries(startPageSize, true);

    });

    //Create a JSZIP to reference later
    zip = new JSZip();
}

//Pagination Load more entries from the database
function pageMore() {

    pageNR++;

    startDatabaseQueries((pageSize * pageNR) + startPageSize, false);
}

function checkSettings() {
    //Get posts and assign callbacks to the server driven actions Added / Changed / Deleted
    var fetchPosts = function (postsRef) {
        postsRef.on('child_added', function (data) {

            if (data.key == "competitionOver") {
                votingOver = data.val();
            }
            if (data.key == "finalWeek") {
                category = (data.val()) ? "finalPosts" : "releasedPosts";
            }
            startDatabaseQueries(startPageSize, true);

        });
        postsRef.on('child_changed', function (data) {

            if (data.key == "competitionOver") {
                votingOver = data.val();
            }
            if (data.key == "finalWeek") {
                category = (data.val()) ? "finalPosts" : "releasedPosts";
            }

        });

    };

    //Grab only so many items 
    var query = firebase.database().ref("settings");

    // Fetching and displaying all posts of each sections.
    fetchPosts(query);

    //Start grabbing entries 

}

//Starts listenting for new posts
function startDatabaseQueries(loadItems) {

    //Get posts and assign callbacks to the server driven actions Added / Changed / Deleted
    var fetchPosts = function (postsRef, sectionElement, admin) {
        postsRef.on('child_added', function (data) {

            //We get one item too much from the server just don't do anything with that data
            if (!loadedKeys.includes(data.key)) {

                console.log(data.key);
                var containerElement = sectionElement;

                //Save the entrykey for the next time we paginate
                // lastKey = data.key;
                loadedKeys.push(data.key);

                var child = containerElement.lastChild//( loadedKeys > 1) ? containerElement.lastChild : containerElement.firstChild;

                insertAfter(createPostElement(user, data.key, data.val().claim, data.val().author, data.val().previewImg, admin),
                    child);
                //Add the element on top of all elements
                // containerElement.insertBefore(
                //     createPostElement(user, data.key, data.val().claim, data.val().author, data.val().previewImg, admin),
                //     child);

            }
        });
        postsRef.on('child_changed', function (data) {
            //The only thing that can change is the star count when others vote for the object
            sectionElement.querySelector("#" + data.key).getElementsByClassName('like-count')[0].innerText = data.val().likeCount;
        });
        postsRef.on('child_removed', function (data) {
            //Just delete the post 
            var post = sectionElement.querySelector("#" + data.key);
            post.parentElement.removeChild(post);
        });
    };

    //Grab only so many items 
    var query = firebase.database().ref(category);
    // unlockedPostsRef = query.endAt(null, lastKey).limitToLast(loadItems);//limitToFirst(loadItems);
    console.log(category);

    // if (intial)    
    // unlockedPostsRef = query.orderByChild("unlockDate").limitToLast(loadItems);//limitToFirst(loadItems);

    unlockedPostsRef = query.limitToLast(loadItems);//limitToFirst(loadItems);
    // else
    //     unlockedPostsRef = query.endAt(null, loadedKeys[loadedKeys.length - 1]).limitToLast(loadItems);//limitToFirst(loadItems);


    // Fetching and displaying all posts of each sections.
    fetchPosts(unlockedPostsRef, unlockedPostsSection, category + "/");//""releasedPosts/");

    // Keep track of all Firebase refs we are listening to.
    listeningFirebaseRefs.push(unlockedPostsRef);

}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

//After the login check if there is a post ID
function checkViewer(postID) {

    //If there is no postID written with ?view=UUIDOfTheProject don't do a thing
    if (postID == "undefined" || postID == undefined) {
    } else {
        initializePreview(postID);
    }
}

//Open the preview
function initializePreview(previewNew) {

    document.getElementById("modules").src = "viewer/index.html?id=" + previewNew;
    overlay.style.display = "block";
    overlay.style.opacity = "0";
    TweenMax.to(overlay, 1, { opacity: 1, delay: 0.4 });

}

//Create a Cell
function createPostElement(user, postId, claim, author, preview, postLocation) {

    // Create the DOM element from the HTML.
    var div = document.createElement('div');
    div.innerHTML = getStoreHTML(postId);
    var postElement = div.firstChild;

    // Set values.
    postElement.getElementsByClassName('claim')[0].innerText = claim;
    postElement.getElementsByClassName('username')[0].innerText = author || 'Anonymous';
    var star = postElement.getElementsByClassName('like')[0];

    //Get the thumbnail element
    var preview = postElement.getElementsByClassName('thumbnail')[0];

    //Download the thumbnail
    getThumbnail(preview, postId);

    //Function to open the preview 
    var openPreview = function () {

        firebase.database().ref(postLocation).child(postId).once('value').then(function (snapshot) {

            initializePreview(snapshot.key);
        });
    }
    preview.onclick = openPreview;


    // Listen for likes counts.
    var starCountRef = firebase.database().ref(postLocation + postId + '/likeCount');
    starCountRef.on('value', function (snapshot) {
        updateStarCount(postElement, snapshot.val());
    });

    // Listen for the starred status.
    var starredStatusRef = firebase.database().ref(postLocation + postId + '/likes/' + user)
    starredStatusRef.on('value', function (snapshot) {
        updateStarredByCurrentUser(postElement, snapshot.val());
    });

    // Keep track of all Firebase reference on which we are listening.
    listeningFirebaseRefs.push(starCountRef);
    listeningFirebaseRefs.push(starredStatusRef);

    // Bind starring action.
    var onStarClicked = function () {
        if (!votingOver) {
            var postRef = firebase.database().ref(postLocation + postId);
            toggleLike(postRef, user);
        }
    };

    star.onclick = onStarClicked;

    return postElement;
}

//Downloads the thumbnail from the firebase storage
function getThumbnail(thumbnail, id) {

    //Get a link to the firebase storage
    var storageRef = firebase.storage().ref();

    // Create a reference to the file we want to download
    var entriesRef = storageRef.child("texture/p_" + id + '.jpg');

    // Get the download URL
    entriesRef.getDownloadURL().then(function (url) {

        thumbnail.querySelector("#img").setAttribute('src', url);
    });
}

//Update the like element @KAY CSS Shizzle
function updateStarredByCurrentUser(postElement, starred) {
    if (starred) {
    } else {
    }
}

//Update the like count of the postElement card text
function updateStarCount(postElement, nbStart) {
    postElement.getElementsByClassName('like-count')[0].innerText = nbStart;
}

//Do a transation and update the online like count
function toggleLike(postRef, uid) {
    console.log(uid);
    postRef.transaction(function (post) {
        if (post) {
            if (post.likes && post.likes[uid]) {
                post.likeCount--;
                post.likes[uid] = null;
            } else {
                post.likeCount++;
                if (!post.likes) {
                    post.likes = {};
                }
                post.likes[uid] = true;
            }
        }
        return post;
    });
}

//The cell html which gets filled with data from the server
function getStoreHTML(postID) {
    var html =
        '<div class="cell" id="' + postID + '" >' +
        '<div class="callout">' +
        '<div class="thumbnail"><img id="img" src="assets/thumb.jpg"></div>' +
        '<div class="username">Toni AutoCrop LongName</div>' +
        '<div class="like"><img src="assets/heart.svg"></div>' +
        '<div class="like-count">11</div>' +
        '<div class="claim">' +
        'Das ist ein langer Claim der mindestens 140 Zeichen lang ist.' +
        'Das kann schonmal vorkommen, dass jemandem solche Sachen einfallen. Gut !!!!!!' +
        '</div>' +
        '</div>' +
        '</div>'
    return html;
}
