$("#covid").click(function(){

    window.open("https://ucalgary.ca/risk/emergency-management/covid-19-response");

})


$("#email").click(function(){

    copyToClipboard("physastr@ucalgary.ca");
    $("#emailid").html("Email Copied to Clipboard");

})

$("#instagram").click(function(){

    window.open("https://www.instagram.com/ucalgarypasa");

})

$("#facebook").click(function(){

    window.open("https://www.fb.com/UCalgaryPASA");

})

function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}