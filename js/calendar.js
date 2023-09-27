// element references
const calendarSelection = "#calendar-selection";
const calendar = "#calendar-frame";

// define colours for each calendar
colours = [
    "0074D9",
    "2ECC40",
    "FF4136",
    "B10DC9",
    "FF851B",
    "39CCCC",
    "FF80CC"
];

checkboxes = [];    // stores the checkbox elements with the corresponding calendar ids

// adds calendars based on the state of checkboxes
function updateCalendar() {

    // constant base url
    var calendarUrl = "https://calendar.google.com/calendar/embed"
                    + "?wkst=1"             // start week on sunday
                    + `&bgcolor=${encodeURIComponent('#')}E3E9FF`  // frame same colour as interior
                    + `&ctz=America${encodeURIComponent('/')}Edmonton`     // timezone
                    + "&showCalendars=0"    // hide calendars checkboxes
                    + "&showPrint=0"        // hide print button
                    + "&showTitle=0"        // hide title
                    + "&showTabs=0"         // hide week/month/agenda tabs
                    + "&mode=MONTH"         // show month view
    
    // check each box
    checkboxes.forEach(function (element, i) {
        if (element.checkbox.checked) {
            calendarUrl += `&src=${element.calendar}${encodeURIComponent('@')}group.calendar.google.com`;
            calendarUrl += `&color=${encodeURIComponent('#')}${colours[i]}`;
        };
    });

    // update the iframe
    $(calendar).attr({"src": calendarUrl});

};

$(document).ready(function() {

    // load calendar data
    fetch("/data/googleapi.json")
        .then((response) => response.json())
        .then((config) => {
            config.calendars.unshift({
                name: "PASA Events & Important Dates",
                id: config.eventsCalendarId
            });
            config.calendars.forEach(function (element, i) {
                // build calendar urls for users to import into their calendars
                var googleUrl = `https://calendar.google.com/calendar/u/0?cid=${element.id}@group.calendar.google.com`;
                var icalUrl = `https://calendar.google.com/calendar/ical/${element.id}@group.calendar.google.com/public/basic.ics`

                // build checkbox
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `calendar-toggle${i}`;
                if (i == 0) {   // the first element is always the events calendar
                    checkbox.checked = "true";
                };
                checkbox.addEventListener("change", updateCalendar);
                checkboxes.push({
                    checkbox: checkbox,
                    calendar: element.id
                });
                
                // add elements
                $(`<tr><td>`).appendTo(calendarSelection);
                $(calendarSelection).append(checkbox);
                $(`</td><td>${element.name}</td>`).appendTo(calendarSelection);
                $(`<td><a href="${googleUrl}">Add to Google Calendar</a></td>`).appendTo(calendarSelection);
                $(`<td><a href="#" id="ical${i}">Copy iCal link</a></td>`).appendTo(calendarSelection);
                $(`</tr>`).appendTo(calendarSelection);

                // setup click action to copy iCalendar link 
                $(`#ical${i}`).click(() => {
                    navigator.clipboard.writeText(icalUrl);
                    $(`#ical${i}`).attr("data-original-title", "Copied to clipboard!");
                    $(`#ical${i}`).tooltip("show");
                });
                // make tooltip only appear the first time
                $(`#ical${i}`).mouseleave(() => {
                    $(`#ical${i}`).tooltip("disable");
                });
            });

            updateCalendar();   // creates the calendar for the first time

        });

});
