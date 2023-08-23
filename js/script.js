// ----- Theme Toggle -----

// Get/Initialize local storage dark mode value
let darkMode = localStorage.getItem("darkMode");
if (darkMode === null) {
    darkMode = "dark"
    localStorage.setItem("darkMode", "dark");
}

// Define theme transitioning
const themeTransition = () => {
    document.documentElement.classList.add("transition");
    window.setTimeout(() => {
        document.documentElement.classList.remove("transition");
    }, 300);
};

// Toggle on dark mode
const enableDarkMode = () => {
    localStorage.setItem("darkMode", "dark");

    themeTransition();

    document.documentElement.setAttribute("data-theme", "dark");
    $("#night").addClass("hide");
    $("#light").removeClass("hide");
};

// Toggle off dark mode
const disableDarkMode = () => {
    localStorage.setItem("darkMode", "light");

    themeTransition();

    document.documentElement.setAttribute("data-theme", "light");
    $("#light").addClass("hide");
    $("#night").removeClass("hide");
};

var checkbox = document.querySelector("input[name=theme]");

// Activate dark mode
if (darkMode === "dark") {
    enableDarkMode();
} else if (darkMode === "light") {
    disableDarkMode();
    checkbox.checked = true;
}

// Enable theme toggle button functionality
checkbox.addEventListener("change", function() {
    if (this.checked) 
        disableDarkMode();
    else 
        enableDarkMode();
});

// ----- Typing Animation -----
var title = document.querySelector(".typed");
if (title !== null) {
    var pos = 0;
    var speed = 90;
    var typed = title.innerText;

    // empty the typed from span
    title.innerText = '';

    // typing function
    function type() {
        if (pos < typed.length) {
            document.querySelector('.typed').innerHTML += typed.charAt(pos);
            pos++;
            setTimeout(type, speed); // call this function again to type all letters
        }
        // else {
        //     setTimeout(erase, speed);
        // }
    }

    //start type
    setTimeout(type, speed);

    // erase function
    function erase() {
        if (pos >= 0) {
            var temp = typed.substring(0, pos);
            document.getElementById('typed').innerText = temp;
            pos--;
            setTimeout(erase, speed);
        } else {
            // start type again
            setTimeout(type, speed);
        }
    }
}


// Make avatar height same as width

function fixsize() {
    var cw = $('.av-img').width();
    $('.av-img').css({ 'height': cw + 'px' });
}

window.addEventListener("resize", fixsize);
fixsize();

// menu marker animation

function menuChange() {
    if ($('#hori').is(':visible')) {
        var marker = document.querySelector('#marker');
        var item = document.querySelectorAll('nav a');

        function indicator(e) {
            marker.style.left = e.offsetLeft + "px";
            marker.style.width = e.offsetWidth + "px";
        }

        item.forEach(link => {
            link.addEventListener('mouseover', (e) => {
                indicator(e.target);
            })
        })
    }
}

if ($('#marker').length) {
    $(window).resize(function () {
        marker.style.left = 0;
        marker.style.width = 0;
        menuChange();
    });
};
menuChange();

// ----- Cursor Selection -----

// Get root path
const getCurrentFileName = () => {
    var pagePathName= window.location.pathname;
    return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}
var root = "../";
if (getCurrentFileName().includes("index.html")) {
    root = "";
}

// CSS ids and associated file names
const cursors = {
    "#grogu": "grogu_cursor.cur",
    "#cashew": "cashew_cursor.cur",
    "#bigchung": "big_chungus_cursor.cur",
}

// Add functionality to cursor selection
for (let [key, value] of Object.entries(cursors)) {
    $(key).click(() => {
        $("body").css("cursor", `url(${root}assets/cursors/${value}), auto`);
        localStorage.setItem("cursor", key);
    });
}

// Reset cursor to default
$("#default").click(() => {
    $("body").css({"cursor": ""});
    localStorage.setItem("cursor", "default");
});

// Get/Initialize current cursor
var cursor = localStorage.getItem("cursor");
if (cursor === null) {
    cursor = "default";
    localStorage.setItem("cursor", cursor);
}
if (cursor !== "default") {
    $("body").css({"cursor": `url(${root}assets/cursors/${cursors[cursor]}), auto`});
}

// Enable email tooltip
$(document).ready(function() {
    $('#email').tooltip();
});

// Update tooltip when clicking email button
$("#email").click(() => {
    navigator.clipboard.writeText("physastr@ucalgary.ca");
    $("#email").attr('data-original-title', 'Copied to clipboard!');
    $("#email").tooltip('show');
});

// Reset email tooltip text when mouse leaves
$("#email").mouseleave(() => {
    $("#email").attr('data-original-title', 'Click to copy email');
    $("#email").tooltip('hide');
});

$("#instagram").click(() => {
    window.open("https://www.instagram.com/ucalgarypasa");
});

$("#twitter").click(() => {
    window.open("https://www.twitter.com/UCalgaryPASA");
});

// Load content without refreshing

// We're temporarily not doing this

// $(document).ready(function () {
//    // Set trigger and container variables
//    var trigger = $('#princmenu a'),
//        container = $('#updatecontent');
//
//    // Fire on click
//    trigger.on('click', function () {
//        // Set $this for re-use. Set target from data attribute
//        // (idk what the target from data attribute means it's
//        // from the video)
//        var $this = $(this),
//            target = $this.data('target');
//
//        container.fadeOut('slow', function () {
//            container.load(target + '.html', function () {
//                container.fadeIn('slow');
//            });
//        });
//        // // Load target page into container
//        // container.load(target + '.html');
//
//        console.log("Hello! I am an alert box!!");
//
//        // Update exec avatar css property
//        $('.avatar').css('width', '100%');
//        $('.av-img').css('width', '100%');
//
//        // setTimeout(function(){ $('#katelynn').css('background-image','url(assets/media/katelynn.jpg)'); }, 3000);
//
//        setTimeout(function () { $(window).trigger('resize'); }, 3000);
//
//
//
//        // Stop normal link behaviour
//        return false;
//
//
//    });

// });

