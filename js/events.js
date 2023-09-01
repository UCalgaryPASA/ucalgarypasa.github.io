const upcomingEvents = "#upcoming";
const pastEvents = "#previous";

const now = new Date().toISOString();

var apiKey;
var eventsCalendarId;

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
function month(date) {
    return monthNames[date.getMonth()];
};

function nth(date) {
    day = date.getDate()
    if (day > 3 && day < 21) {
        ord = "th";
    } else {
        switch (day % 10) {
            case 1:
                ord = "st";
                break;
            case 2:
                ord = "nd";
                break;
            case 3:
                ord = "rd";
                break;
            default:
                ord = "th";
                break;
        };
    };
    return `${day}${ord}`
};

function timeStr(date) {
    var options = {
        hour: "numeric",
        hour12: true
    };
    if (date.getMinutes() != 0) {
        options.minute = "numeric"
    };
    return date.toLocaleString("en-US", options);
};

function getTimezone(day) {
    tzStr = new Date(day).toLocaleString("en", {timeZone: "America/Edmonton", timeZoneName: "short"});
    return tzStr.split(" ").slice(-1)[0];
};

function addEvents(divId, maxResults = 50, continuationToken = null) {
    
    var apiQuery = "https://www.googleapis.com/calendar/v3/calendars/"
                 + `${eventsCalendarId}${encodeURIComponent('@')}group.calendar.google.com/events`
                 + `?maxResults=${maxResults}`
                 + "&orderBy=startTime"
                 + "&singleEvents=true"
                 + `&timeMin=${now}`
                 + `&key=${apiKey}`;
    
    if (continuationToken !== null) {
        apiQuery += `&continuationToken=${continuationToken}`;
    };

    fetch(apiQuery)
        .then((response) => response.json())
        .then((data) => {
            data.items.forEach(event => {
                $("<div>").appendTo(divId);
                $(`<span><strong>${event.summary}</strong></span><br>`).appendTo(divId);
                
                var displayDatetime = "";
                // all day event
                if ("date" in event.start) {
                    var startTz = getTimezone(event.start.date);
                    var start = new Date(`${event.start.date} ${startTz}`);
                    var endTz = getTimezone(event.start.date);
                    var end = new Date(`${event.end.date} ${endTz}`);
                    end.setDate(end.getDate() - 1);     // google sets all day events to end the next day

                    longspan = false;   // if event spans months or years
                    if (start.getFullYear() != end.getFullYear()) {
                        displayDatetime += `${month(start)} ${nth(start)}, ${start.getFullYear()} - `;
                        longspan = true;
                    } else if (start.getMonth() != end.getMonth()) {
                        displayDatetime += `${month(start)} ${nth(start)} - `;
                        longspan = true;
                    };
                    displayDatetime += `${month(end)} `;
                    if (start.getDate() != end.getDate() && !longspan) {
                        displayDatetime += `${nth(start)} - `;
                    };
                    displayDatetime += `${nth(end)}, ${end.getFullYear()}`;

                // hourly event
                } else {
                    var start = new Date(event.start.dateTime);
                    var end = new Date(event.end.dateTime);
                    displayDatetime = `${timeStr(start)} - ${timeStr(end)}, ${month(end)} ${nth(end)}, ${end.getFullYear()}`
                };

                $(`<span>${displayDatetime}</span><br>`).appendTo(divId);
                
                if (event.location) {
                    $(`<span>${event.location}</span><br>`).appendTo(divId);
                };

                if (event.description) {
                    $(`<span>${event.description}</span><br>`).appendTo(divId);
                };
                
                $("</div><br>").appendTo(divId)
            });
    });

}

$(document).ready(function() {

    // load calendar data
    fetch("/data/googleapi.json")
        .then((response) => response.json())
        .then((config) => {
            apiKey = config.apiKey;
            eventsCalendarId = config.eventsCalendarId;
            addEvents(upcomingEvents)
    });
});
