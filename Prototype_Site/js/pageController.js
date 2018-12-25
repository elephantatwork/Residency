//Cleanup
window.requestAnimFrame = (function(){
    'use strict';

    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


var PageController = function () {
    //Variables

    var allPages = [];
    var currentPage;
    var oldPage;

    init();

    function init() {
        // addEventListener.

        //Debug
        window.addEventListener("keypress", onKeyPress, false);



    }

    //Add the div of a page to the array
    this.addPage = function (element) {
        allPages.push(element);
    }.bind(this);

    this.hideAllPages = function () {
        for (var i = 0; i < allPages.length; i++) {
            console.log(allPages[i].style);
            allPages[i].style.display = "none";
        }
    }.bind(this);

    function onAnimFrame() {
        if (!rafPending) {
            return;
        }

        // var differenceInX = initialTouchPos.x - lastTouchPos.x;

        // var newXTransform = (currentXPosition - differenceInX) + 'px';
        // var transformStyle = 'translateX(' + newXTransform + ')';
        // swipeFrontElement.style.webkitTransform = transformStyle;
        // swipeFrontElement.style.MozTransform = transformStyle;
        // swipeFrontElement.style.msTransform = transformStyle;
        // swipeFrontElement.style.transform = transformStyle;
        console.log("touchy");

        rafPending = false;
    }

    function onKeyPress(e) {
        var keyCode = e.keyCode;
        // console.log(keyCode);
        if (keyCode == 49) { // NUMBER 1   
            showPage(0);
        } else if (keyCode == 50) { // NUMBER 2   
            showPage(1);
        }
        else if (keyCode == 51) { // NUMBER 3   
            showPage(2);
        }
    }

    // Handle the start of gestures
    this.handleGestureStart = function (evt) {

        console.log(evt);

        evt.preventDefault();

        console.log("d");

        if (evt.touches && evt.touches.length > 1) {
            return;
        }

        // Add the move and end listeners
        if (window.PointerEvent) {
            evt.target.setPointerCapture(evt.pointerId);
        } else {
            // Add Mouse Listeners
            document.addEventListener('mousemove', this.handleGestureMove, true);
            document.addEventListener('mouseup', this.handleGestureEnd, true);
        }

        initialTouchPos = getGesturePointFromEvent(evt);

        swipeFrontElement.style.transition = 'initial';
    }.bind(this);

    // Handle the move of gestures
    this.handleGestureMove = function (evt) {
        evt.preventDefault();

        if (!initialTouchPos) {
            return;
        }

        lastTouchPos = getGesturePointFromEvent(evt);

        if (rafPending) {
            return;
        }

        rafPending = true;

        window.requestAnimFrame(onAnimFrame);
    }.bind(this);

    // Handle end gestures
    this.handleGestureEnd = function (evt) {
        evt.preventDefault();

        if (evt.touches && evt.touches.length > 0) {
            return;
        }

        rafPending = false;

        // Remove Event Listeners
        if (window.PointerEvent) {
            evt.target.releasePointerCapture(evt.pointerId);
        } else {
            // Remove Mouse Listeners
            document.removeEventListener('mousemove', this.handleGestureMove, true);
            document.removeEventListener('mouseup', this.handleGestureEnd, true);
        }

        updateSwipeRestPosition();

        initialTouchPos = null;
    }.bind(this);

    function getGesturePointFromEvent(evt) {
        var point = {};

        if (evt.targetTouches) {
            // Prefer Touch Events
            point.x = evt.targetTouches[0].clientX;
            point.y = evt.targetTouches[0].clientY;
        } else {
            // Either Mouse event or Pointer Event
            point.x = evt.clientX;
            point.y = evt.clientY;
        }

        return point;
    }

    showPage = function (id) {

        if (currentPage != null) {
            oldPage = currentPage;
            oldPage.style.display = "none";

            // Check if pointer events are supported.
            if (window.PointerEvent) {
                // Add Pointer Event Listener
                currentPage.removeEventListener('pointerdown', this.handleGestureStart, true);
                currentPage.removeEventListener('pointermove', this.handleGestureMove, true);
                currentPage.removeEventListener('pointerup', this.handleGestureEnd, true);
                currentPage.removeEventListener('pointercancel', this.handleGestureEnd, true);
            } else {
                // Add Touch Listener
                currentPage.removeEventListener('touchstart', this.handleGestureStart, true);
                currentPage.removeEventListener('touchmove', this.handleGestureMove, true);
                currentPage.removeEventListener('touchend', this.handleGestureEnd, true);
                currentPage.removeEventListener('touchcancel', this.handleGestureEnd, true);

                // Add Mouse Listener
                currentPage.removeEventListener('mousedown', this.handleGestureStart, true);
            }

        }



        currentPage = allPages[id];

        currentPage.style.display = "block";

        // Check if pointer events are supported.
        if (window.PointerEvent) {
            // Add Pointer Event Listener
            console.log("start pointer");

            currentPage.addEventListener('pointerdown', this.handleGestureStart, true);
            currentPage.addEventListener('pointermove', this.handleGestureMove, true);
            currentPage.addEventListener('pointerup', this.handleGestureEnd, true);
            currentPage.addEventListener('pointercancel', this.handleGestureEnd, true);
        } else {
            // Add Touch Listener
            console.log("start touch");

            currentPage.addEventListener('touchstart', this.handleGestureStart, true);
            currentPage.addEventListener('touchmove', this.handleGestureMove, true);
            currentPage.addEventListener('touchend', this.handleGestureEnd, true);
            currentPage.addEventListener('touchcancel', this.handleGestureEnd, true);

            // Add Mouse Listener
            console.log("start mouse");

            currentPage.addEventListener('mousedown', this.handleGestureStart, true);
        }

    }
}