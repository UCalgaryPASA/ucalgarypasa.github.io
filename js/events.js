// relevant API docs:
//   https://developers.google.com/calendar/api/v3/reference/events
//   https://developers.google.com/calendar/api/v3/reference/events/list

const upcomingEvents = "#upcoming";
const pastEvents = "#previous";

const now = new Date().toISOString();

var apiKey;
var eventsCalendarId;

// month name shortcut without external libraries
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
function month(date) {
    return monthNames[date.getMonth()];
};

// date ordinal without external libraries
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

// time formatting config shortcut
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

// get the short timezone code for a given date
function getTimezone(day) {
    tzStr = new Date(day).toLocaleString("en", {timeZone: "America/Edmonton", timeZoneName: "short"});
    return tzStr.split(" ").slice(-1)[0];
};

// the following regex removes tags from an html string so it can be split safely
const keepTags = [      // keep these tags
    "b",
    "br",
    "sup",
    "a href=\\?\"([a-z]+:)+[^\\s]+[\\w]\\?\"",
    "a"
];
var pattern = "<";
keepTags.forEach(tag => {
    pattern += `(?!\\/?${tag})`;     // matches open or closing tag
});
pattern += "([^<>]+)>";     // match everything except start/end of tag
const descriptionRegex = new RegExp(pattern, "gimsu");  // to be used in str.replace()

const sentenceRegex = new RegExp("(\\s*(?:[.!?]\\s+|(?:<br>\\s*)+))", "gim");
// split a block of text into an array of sentences
function splitSentences(text) {
    var sentences = [];
    var lastIndex = 0;
    while (match = sentenceRegex.exec(text)) {
        var sentence = text.slice(lastIndex, match.index+match.length);
        addLength = sentence.length;
        if (lastIndex+1 == match.index) {
            sentence = sentences.pop() + sentence;
        };
        sentences.push(sentence);
        lastIndex += addLength;
    };
    return sentences
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
                $(`<span><h5 class="event-title">${event.summary}</h4></span><br>`).appendTo(divId);
                
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

                $(`<span class="event-time">${displayDatetime}</span><br>`).appendTo(divId);
                
                if (event.location) {
                    $(`<span class="event-loc">${event.location}</span><br>`).appendTo(divId);
                };

                if (event.description) {
                    var description = event.description.replace(descriptionRegex, '');
                    var sentences = splitSentences(description);
                    
                    if (sentences.length > 3) {
                        var shortDesc = $(`<span>${sentences.slice(0,3).join('')}</span>`);
                        shortDesc.appendTo(divId);
                        var longDesc = $(`<span id="desc-${event.id}" style="display:none;">${sentences.slice(4,sentences.length).join(' ')}</span>`);
                        longDesc.appendTo(divId);
                        var dots = $(`<button id="dots-${event.id}" class="dots-button" onclick="updateDescription('${event.id}');">...(More)</button>`);
                        dots.appendTo(divId);
                    } else {
                        $(`<span>${description}</span>`).appendTo(divId);
                    }
                };
                
                $("<br><br>").appendTo(divId)
            });
    });

};

// show or hide long description
function updateDescription(eventId) {
    var longDesc = $(`#desc-${eventId}`);
    var dots = $(`#dots-${eventId}`);
    // expand text
    if (longDesc.css("display")=="none") {
        longDesc.css("display", "inline");
        dots.text("(Less)");
    // shrink text
    } else {
        longDesc.css("display", "none");
        dots.text("...(More)");
    };
};

$(document).ready(function() {

    // load calendar data
    fetch("/data/googleapi.json")
        .then((response) => response.json())
        .then((config) => {
            apiKey = config.apiKey;
            eventsCalendarId = config.eventsCalendarId;
            addEvents(upcomingEvents);
    });
});
