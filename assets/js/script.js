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

$(window).resize(function () {
    marker.style.left = 0;
    marker.style.width = 0;
    menuChange();
});

menuChange();

// Other commit comment

// Cursor change code

$(document).ready(function() {

    $('#bigchung').on('click', function() {
        $('body').css('cursor', 'url(assets/cursors/big_chungus_cursor.cur),auto');
    })
})

$(document).ready(function() {

     $('#ugchung').on('click', function() {
        $('body').css('cursor', 'url(assets/cursors/ugandan-chungus-cursor.cur),auto');
    })
})

$(document).ready(function() {

    $('#amus').on('click', function() {
       $('body').css('cursor', 'url(assets/cursors/among-us-pointer.cur),auto');
   })
})

$(document).ready(function() {

    $('#cureset').on('click', function() {
       $('body').css({ 'cursor' : ''});
   })
})

// Load content without refreshing

$(document).ready(function(){
    // Set trigger and container variables
    var trigger = $('#princmenu a'),
        container = $('#updatecontent');

    // Fire on click
    trigger.on('click', function(){
        // Set $this for re-use. Set target from data attribute
        // (idk what the target from data attribute means it's
        // from the video)
        var $this = $(this),
            target = $this.data('target');

            container.fadeOut('slow', function(){
                container.load(target + '.html', function(){
                    container.fadeIn('slow');
                });
            });
        // // Load target page into container
        // container.load(target + '.html');
        
        console.log("Hello! I am an alert box!!");

        // Stop normal link behaviour
        return false;
    

    });


        // Update exec avatar css property
        $(".av-img").css("width", "100%");

        $(document).ready(function() {
            $(window).trigger('resize');
        });
         
        $(window).resize(function() {
            alert('Handler for .resize() called!');
        });

});

