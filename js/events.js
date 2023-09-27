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
    // find each sentence delimiter
    while (match = sentenceRegex.exec(text)) {
        var sentence = text.slice(lastIndex, match.index+match.length);
        if (sentence.endsWith("<b")) sentence += "r>";  // fix inconsistent match length
        addLength = sentence.length;
        if (lastIndex+1 == match.index) {   // extend sentence if two delimeters without space between
            sentence = sentences.pop() + sentence;
        };
        sentences.push(sentence);
        lastIndex += addLength;
    };
    sentences.push(text.slice(lastIndex));   // add remaining text
    return sentences
};

// adds the results of an API call to the events page
async function addEvents(divId, ascending = true, nextPageToken = null) {
    
    var apiQuery = "https://www.googleapis.com/calendar/v3/calendars/"
                 + `${eventsCalendarId}${encodeURIComponent('@')}group.calendar.google.com/events`
                 + "?orderBy=startTime"
                 + "&singleEvents=true"
                 + `&key=${apiKey}`;
                //  + "&maxResults=5"   // for development purposes
    
    if (ascending) {
        apiQuery += `&timeMin=${now}`;
    } else {
        apiQuery += `&timeMax=${now}`;
    };
    
    if (nextPageToken !== null) {
        apiQuery += `&pageToken=${nextPageToken}`;
    };

    data = await (await fetch(apiQuery)).json();
    data.items.forEach(event => {

        // skip non-flagged events
        if (!("extendedProperties" in event)) {
            return;
        };
        if (!("displayOnWebsite" in event.extendedProperties.private)) {
            return;
        };
        if (event.extendedProperties.private.displayOnWebsite == "false") {
            return;
        };

        var html = `<div>
            <span><h5 class="event-title">${event.summary}</h4></span>
            <br>
            <span class="event-time">`;
        
        // all day event
        if ("date" in event.start) {
            var startTz = getTimezone(event.start.date);
            var start = new Date(`${event.start.date} ${startTz}`);
            var endTz = getTimezone(event.start.date);
            var end = new Date(`${event.end.date} ${endTz}`);
            end.setDate(end.getDate() - 1);     // google sets all day events to end the next day

            longspan = false;   // if event spans months or years
            if (start.getFullYear() != end.getFullYear()) {
                html += `${month(start)} ${nth(start)}, ${start.getFullYear()} - `;
                longspan = true;
            } else if (start.getMonth() != end.getMonth()) {
                html += `${month(start)} ${nth(start)} - `;
                longspan = true;
            };
            html += `${month(end)} `;
            if (start.getDate() != end.getDate() && !longspan) {
                html += `${nth(start)} - `;
            };
            html += `${nth(end)}, ${end.getFullYear()}`;

        // hourly event
        } else {
            var start = new Date(event.start.dateTime);
            var end = new Date(event.end.dateTime);
            html += `${timeStr(start)} - ${timeStr(end)}, ${month(end)} ${nth(end)}, ${end.getFullYear()}`
        };

        html += `</span><br>`;
        
        if (event.location) {
            html += `<span class="event-loc">${event.location}</span><br>`;
        };

        if (event.description) {
            var description = event.description.replace(descriptionRegex, '');
            var sentences = splitSentences(description);
            
            if (sentences.length > 3) {
                html += `<span>${sentences.slice(0,3).join('')}</span>`;
                html += `<span id="desc-${event.id}" style="display:none;">${sentences.slice(3,sentences.length).join(' ')}</span>`;
                html += `<button id="dots-${event.id}" class="dots-button" onclick="updateDescription('${event.id}');">...(More)</button>`;
            } else {
                html += `<span>${description}</span>`;
            }
        };
        
        html += "</div><br><br>";

        if (ascending) {
            $(html).appendTo(divId);
        } else {
            $(html).prependTo(divId);
        }
    
    });

    return data.nextPageToken;

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

$(document).ready(async function() {

    // load calendar data
    config = await (await fetch("/data/googleapi.json")).json();
    apiKey = config.apiKey;
    eventsCalendarId = config.eventsCalendarId;

    // display events
    var nextPageToken = null
    while (nextPageToken = await addEvents(upcomingEvents, true, nextPageToken));
    while (nextPageToken = await addEvents(pastEvents, false, nextPageToken));
});
