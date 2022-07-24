var pos = 0;
var speed = 90;
var typed = document.querySelector(".typed").innerText;
console.log(typed);

// empty the typed from span
document.querySelector(".typed").innerText = '';

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

// Make avatar height same as width

function fixsize() {
    var cw = $('.av-img').width();
    $('.av-img').css({ 'height': cw + 'px' });
}

window.addEventListener("resize", fixsize);

fixsize();

// light night toggle

var checkbox = document.querySelector('input[name=theme]');

checkbox.addEventListener('change', function () {
    if (this.checked) {
        trans()
        document.documentElement.setAttribute('data-theme', 'light')
        $('#light').addClass('hide');
        $('#night').removeClass('hide')
    } else {
        trans()
        document.documentElement.setAttribute('data-theme', 'dark')
        $('#night').addClass('hide');
        $('#light').removeClass('hide')
    }
})

let trans = () => {
    document.documentElement.classList.add('transition');
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 300)
}

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


function getCurrentFileName() {
    var pagePathName= window.location.pathname;
    return pagePathName.substring(pagePathName.lastIndexOf("/") + 1);
}

// Update CSS upon clicking new cursors
var root = "../"
if (getCurrentFileName().includes("index.html")) {
    root = ""
}

$(document).ready(function () {
    $('#grogu').on('click', function () {
        $('body').css('cursor', `url(${root}assets/cursors/grogu_cursor.cur), auto`);
    })
})

$(document).ready(function () {
    $('#cashew').on('click', function () {
        $('body').css('cursor', `url(${root}assets/cursors/cashew_cursor.cur), auto`);
    })
})

$(document).ready(function () {
    $('#bigchung').on('click', function () {
        $('body').css('cursor', `url(${root}assets/cursors/big_chungus_cursor.cur), auto`);
    })
})

$(document).ready(function () {
    $('#ugchung').on('click', function () {
        $('body').css('cursor', `url(${root}assets/cursors/ugandan-chungus-cursor.cur), auto`);
    })
})

$(document).ready(function () {
    $('#amus').on('click', function () {
        $('body').css('cursor', `url(${root}assets/cursors/among-us-pointer.cur), auto`);
    })
})
$(document).ready(function () {
    $('#cureset').on('click', function () {
        $('body').css({'cursor': ''});
    })

    $('a[href*="https://elfsight.com/event-calendar-widget/?utm_source=websites&utm_medium=clients&utm_content=event-calendar&utm_term=www.pasa.website&utm_campaign=free-widget"]').parent('div').remove();
})

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

$("#facebook").click(() => {
    window.open("https://www.fb.com/UCalgaryPASA");
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

