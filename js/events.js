$(document).ready(function () {
    $.get("../data/events.yaml", null, (response) => {
        // Read events from YAML file
        var events = jsyaml.load(response);
        // console.log("Events", events);

        // Sort events by date
        var groups = _.groupBy(events, function(event) { 
            return moment(event.start).format('YYYY-MM-DD'); 
        });
        days = _.sortBy(Object.keys(groups));

        // console.log("Groups:", groups);
        // console.log("Event Days:", days);

        // Define HTML ids
        const upcomingEvents = "#events";
        const pastEvents = "#past-events";

        // Define HTML for events
        const addEvents = (events, id) => {
            // Add events
            events.forEach(event => {
                event.starttime = moment(event.start).format("h:mm a");
                event.endtime = moment(event.end).format("h:mm a");

                // console.log(event);

                // Append event details
                if (event.title) {
                    $('<span><strong>' + event.title + '</strong>  </span>').appendTo(id);
                }
                if (event.venue) {
                    $('<br /><span class="p-location location h-card vcard"><span>' + event.venue + '</span> ' + '</span>').appendTo(id);
                }
                if (!event.allday) {
                    $(`<span> - ${event.starttime}</span>`).appendTo(id);
                }
                if (event.summary) {
                    $('<br /><span class="p-name summary">' + event.summary + '</span>').appendTo(id);
                }
                if (event.website) {
                    $('<br /><a href="' + event.website + '" class="ml small"> <i class="icon-link-ext"></i> Link Here</a>').appendTo(id);
                }

                $("<br />").appendTo(id);
                $('</div>').appendTo(id);
                $("<br />").appendTo(id);
            });
        };

        // Add upcoming events in chronological order     
        days.forEach(function (day) {
            if (moment(day).isAfter(moment().subtract('days', 1))) {
                // Add date heading
                $('<h5><time class="dt-start dtstart">' + moment(day).format('MMMM Do, YYYY') + '</time></h5>').appendTo(upcomingEvents);

                // Sort the day's events by time
                groups[day].sort(function(a, b) {
                    start = moment(a.start).format("h:mm a");
                    end = moment(b.start).format("h:mm a");
                    return start.localeCompare(end);
                });

                // Add events for this day
                addEvents(groups[day], upcomingEvents);
            }
        });

        /// Add past events in reverse chronological order 
        days.reverse().forEach(function (day) {
            if (moment(day).isBefore(moment().subtract('days', 1))) {
                // Add date heading
                $('<h5><time class="dt-start dtstart">' + moment(day).format('MMMM Do, YYYY') + '</time></h5>').appendTo(pastEvents);

                // Sort the day's events by time
                groups[day].sort(function(a, b) {
                    start = moment(a.start).format("h:mm a");
                    end = moment(b.start).format("h:mm a");
                    return start.localeCompare(end);
                });

                // Add events for this day
                addEvents(groups[day], pastEvents);
            }
        });
    });
});
