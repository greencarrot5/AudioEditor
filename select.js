var currentlySelected = [];

canvas.addEventListener("mousedown", function(e) {

    var selected = selectedMediaItem(e.pageX - canvas_position.left, e.pageY - canvas_position.top);

    if (selected) {

        currentlySelected = [selected];

    } else {

        currentlySelected = [];

    }

});

window.addEventListener("keydown", function(e) {

    if (e.key == "Backspace" || e.key == "Delete") {

        //Remove selection
        for (var i=0;i<currentlySelected.length;i++) {

            var item = currentlySelected[i];

            addAction(Action.REMOVE_MEDIA, {item: item});

            var index = items.indexOf(item);

            items.splice(index, 1);

        }

        currentlySelected = [];

    }

});

var moving_item = false;
var actually_moving_item = false;
var moving_x = 0;
var moving_y = 0;

window.addEventListener("mousedown", function(e) {

    if (currentlySelected.includes(selectedMediaItem(e.pageX - canvas_position.left, e.pageY - canvas_position.top))) {

        moving_item = true;

        moving_x = e.pageX;
        moving_y = e.pageY;

    }

});

window.addEventListener("mousemove", function(e) {

    if (moving_item && !actually_moving_item) {

        var dx = Math.abs(e.pageX - moving_x);

        if (dx / canvas.width > MOVE_THRESHOLD) {

            if (currentlySelected.length > 1) {

                console.error("Moving multiple items at once is not supported.");
                return;

            }

            var item = currentlySelected[0];

            //Determine grab offset
            grabX = e.pageX - canvas_position.left - timeToX(item.time);
            grabY = e.pageY - canvas_position.top - heightOfTrack(item.track);

            currentAudioDuration = item.duration;

            var index = items.indexOf(item);

            items.splice(index, 1);

            actually_moving_item = true;

        }

    }

    if (actually_moving_item) {

        //Convert to timestamp
        var hovered_timestamp = (e.clientX - grabX - canvas_position.left - OFFSET) / pixels_per_second + timeline_start;

        //Get closest available timestamp
        var timestamp = closestTimestamp(hovered_timestamp, currentAudioDuration);

        //Convert back to x position
        var xPosition = timeToX(timestamp) + canvas_position.left;

        shadow = {
            x: xPosition,
            y: e.clientY - grabY,

            width: currentAudioDuration,
            height: canvas.height / MAX_TIMELINES
        };

    }

});

window.addEventListener("mouseup", function(e) {

    if (actually_moving_item) {

        var hovered_timestamp = (e.clientX - grabX - canvas_position.left - OFFSET) / pixels_per_second + timeline_start;

        var timestamp = closestTimestamp(hovered_timestamp, currentAudioDuration);

        addAction(Action.MOVE_MEDIA, {item: currentlySelected[0], from: currentlySelected[0].time, to: timestamp});

        currentlySelected[0].time = timestamp;

        items.push(currentlySelected[0]);

        shadow = {

            x: 0,
            y: 0,

            width: 0,
            height: 0

        };

        currentlySelected = [];

    }

    moving_item = false;
    actually_moving_item = false;

});