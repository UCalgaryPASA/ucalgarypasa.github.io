// relevant API docs:
//   https://developers.google.com/identity/oauth2/web/reference/js-reference
//   https://developers.google.com/calendar/api/v3/reference/events/update

var clientId;
var eventsCalendarId;

const token = {
    token: null,
    expiresAt: null
};

var eventsAdded = false;

// get a request token
function auth(type) {
    google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "https://www.googleapis.com/auth/calendar.events",
        prompt: type,
        callback: loadContent,
        error_callback: onError
    }).requestAccessToken();
};

async function calendarRequest(url, body = null) {
    url = `https://www.googleapis.com/calendar/v3/calendars/${eventsCalendarId}%40group.calendar.google.com/events` + url;
    // refresh token if expired
    if (token.expiresAt < new Date()) {
        auth("none");
    };
    // build auth headers
    var options = {
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token.token}` }
    };
    // if no body, assume a get request
    if (body === null) {
        options.method = "GET";
    // if has body, assume a put request
    } else {
        options.method = "PUT";
        options.body = JSON.stringify(body);
    }
    return await (await fetch(url, options)).json();
};

async function loadContent(response) {
    if (response.error) {
        console.log("An Error Occurred");
        console.error(response);
        displayAuthError(`<p>error code: ${response.code} <code>${response.error}</code></p>`);
    } else {
        // set token 
        token.token = response.access_token;
        token.expiresAt = new Date();
        token.expiresAt.setSeconds(token.expiresAt.getSeconds() + response.expires_in - 60);

        // display calendar events
        if (!eventsAdded) {
            $("#main").html("");
            var nextPageToken = null;
            var firstCall = true;
            var currentDate = new Date();
            var currentDateSet = false;
            // get all events
            while (nextPageToken !== null || firstCall) {
                var url = "?orderBy=startTime&singleEvents=true";
                if (nextPageToken !== null) {
                    url += `&pageToken=${nextPageToken}`;
                };
                data = await calendarRequest(url);
                firstCall = false;
                // update nextPageToken
                if ("nextPageToken" in data) {
                    nextPageToken = data.nextPageToken;
                } else {
                    nextPageToken = null;
                };

                if (!["writer", "owner"].includes(data.accessRole)) {
                    displayAuthError("<p>You do not have permission to write to this resource.<br>"
                                    +`You have: <code>${data.accessRole}</code>. You need <code>writer</code> or <code>owner</code>.</p>`)
                    break;
                }

                data.items.forEach(event => {
                    divId = `event-${event.id}`
                    $(`<div id=${divId}>`).appendTo("#main");

                    // initialize properties
                    if (!("extendedProperties" in event)) {
                        event.extendedProperties = {private: {}};
                    };
                    if (!("displayOnWebsite" in event.extendedProperties.private)) {
                        event.extendedProperties.private.displayOnWebsite = "false";
                    };
                    // build checkbox
                    var checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = `toggle-${event.id}`;
                    checkbox.checked = (event.extendedProperties.private.displayOnWebsite == "true");
                    checkbox.addEventListener("change", (ev) => {
                        // update the event
                        event.extendedProperties.private.displayOnWebsite = ev.currentTarget.checked.toString();
                        calendarRequest(`/${event.id}`, event);
                    });
                    $("#main").append(checkbox);

                    // display event title and date
                    if ("date" in event.start) {
                        var date = new Date(event.start.date);
                        var dateStr = date.toUTCString();
                    } else {
                        var date = new Date(event.start.dateTime);
                        var dateStr = date.toString().split("-")[0];    // remove tz full name
                    };
                    dateStr = dateStr.split(" ").slice(0,-1).join(" ")      // remove tz info (appears as GMT)
                    $(`<strong>${event.summary}</strong> &mdash; ${dateStr}</div>`).appendTo("#main");

                    // jump to next event
                    if (date > currentDate && !currentDateSet) {
                        window.location.hash = divId;
                        currentDateSet = true;
                    };
                });
            };
        };
    };
};

function onError(err) {
    console.error("popup error:", err.type);
    displayAuthError("<p>Could not display authentication pop-up.<br>"
                    +`error code: <code>${err.type}</code></p>`);
};

function displayAuthError(messageHtml) {
    $("#main").html("");
    $("<h2>Authentication Error</h2>").appendTo("#main");
    $(messageHtml).appendTo("#main");
    var button = document.createElement("BUTTON")
    button.innerHTML = "<p>switch account</p>"
    button.addEventListener ("click", function() {
        auth("select_account");
    });
    $("#main").append(button);
};

$(document).ready(function() {
    // get data from config file
    fetch("/data/googleapi.json")
        .then((response) => response.json())
        .then((config) => {
            clientId = config.clientId;
            eventsCalendarId = config.eventsCalendarId;
            auth("");
    });
});
