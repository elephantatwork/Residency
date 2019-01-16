// var adminLogin = function () {


    var secret = "6568777378";//admin //"3838404037393739666513"; //Konami Code
    var input = "";
    var timer;

    $(document).ready(function () {
        $('#flash').hide();
    });



    $(document).keyup(function (e) {
        //alert(e.which); 
        input += e.which;
        clearTimeout(timer);
        timer = setTimeout(function () { input = ""; }, 500);
        check_input();
    });

    function check_input() {
        if (input == secret) {
            //the secret code 
            document.location.href = document.location.origin+"/admin.html";
        }
    };

    $(document).ready(function () {
        setInterval(function () { $('#info').html('Keystroke: ' + input); }, 100);
    });
// }