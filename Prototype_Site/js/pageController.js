

// 'use strict';

// // var PageController = function () {
// //Variables
// var allPages = [];
// var currentPage;
// var oldPage;
// var isCenterPage = true;

// init();

// function init() {
//     // addEventListener.

//     //Debug
//     window.addEventListener("keypress", onKeyPress, false);

// }

// //Add the div of a page to the array
// function addPage(element) {
//     allPages.push(element);
// }

// function onKeyPress(e) {
//     var keyCode = e.keyCode;
//     // console.log(keyCode);
//     if (keyCode == 49) { // NUMBER 1  
//         console.log(this);
//         showPage(0);
//     } else if (keyCode == 50) { // NUMBER 2   
//         showPage(1);
//     }
//     else if (keyCode == 51) { // NUMBER 3   
//         showPage(2);
//     }
// }




// function showPage(id) {
//     console.log(id);

//     if (currentPage != null) {
//         oldPage = currentPage;
//         // oldPage.style.display = "none";

//     }

//     currentPage = allPages[id];

//     // currentPage.style.display = "block";

// //     // Check if pointer events are supported.

// // }

// //Cleanup
// window.requestAnimFrame = (function () {
//     'use strict';

//     return window.requestAnimationFrame ||
//         window.webkitRequestAnimationFrame ||
//         window.mozRequestAnimationFrame ||
//         function (callback) {
//             window.setTimeout(callback, 1000 / 60);
//         };
// })();