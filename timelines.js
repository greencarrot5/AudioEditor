//Manages the canvas rendering of timelines
var canvas = document.createElement("canvas");
canvas.width = window.innerWidth - document.getElementById("media").getBoundingClientRect().width - document.getElementById("options").getBoundingClientRect().width;
canvas.height = window.innerHeight - document.getElementById("header").getBoundingClientRect().height;
document.getElementById("timeline").appendChild(canvas);
var pencil = canvas.getContext("2d");

window.addEventListener("resize", function(e) {

    canvas.width = window.innerWidth - document.getElementById("media").getBoundingClientRect().width - document.getElementById("options").getBoundingClientRect().width;
    canvas.height = window.innerHeight - document.getElementById("header").getBoundingClientRect().height;

});

var timeline_start = 0;
var timeline_span = 60;

var pixels_per_second = canvas.height / timeline_span;

const OFFSET = canvas.width / 50;

items = [];

function insertMediaItem(item) {

    items.push(item);

}



var shadow = {

    x: 0,
    y: 0,
    width: 0,
    height: 0

};

function heightOfTrack(num) {

    return canvas.height/2 - canvas.height/MAX_TIMELINES/2;

}

function getBestDivision(span) {

    if (span <= 20) {

        return 1;

    } else if (span <= 80) {

        return 5;

    } else if (span <= 240) {

        return 10;

    } else if (span <= 780) {

        return 30;

    } else if (span <= 1500) {

        return 60;

    } else {

        return 300;

    }

}

function timeDisplay(seconds) {

    seconds = Math.floor(seconds);

    remainder = seconds % 60;

    if (remainder < 10) {

        remainder = "0" + remainder;

    }

    return Math.floor(seconds / 60) + ":" + remainder;

}

function timeToX(timestamp) {

    return (timestamp - timeline_start) * pixels_per_second + OFFSET;

}

function xToTime(x) {

    return (x - OFFSET) / pixels_per_second + timeline_start;

}



function getObstacle(timestamp, duration) {

    for (var i=0;i<items.length;i++) {

        if ((items[i].time >= timestamp && items[i].time < timestamp + duration) || (items[i].time + items[i].duration > timestamp && items[i].time + items[i].duration <= timestamp + duration) || (items[i].time > timestamp && items[i].time + items[i].duration < timestamp + duration)) {

            return items[i];

        }

    }

    return null;

}

function closestTimestamp(timestamp, duration) {

    if (duration == 0) {

        return timestamp;

    }

    //If timestamp itself is available, place it there
    if (timestamp >= 0 && getObstacle(timestamp, duration) == null) {

        return timestamp;

    }

    //Get the closest position where the media item can be dropped
    closest_left = timestamp;
    closest_right = timestamp;

    var obstacle = getObstacle(timestamp, duration);

    while (obstacle) {

        closest_left = obstacle.time - duration;

        obstacle = getObstacle(closest_left, duration);

    }

    //Don't go below zero
    if (closest_left < 0) {

        closest_left = -Infinity;

    }



    if (timestamp < 0) {

        closest_right = 0;

    }

    obstacle = getObstacle(closest_right, duration);

    while (obstacle) {

        closest_right = obstacle.time + obstacle.duration;

        obstacle = getObstacle(closest_right, duration);

    }

    console.log("Left: " + Math.abs(closest_left - timestamp) + ", right: " + Math.abs(closest_right - timestamp));

    if (Math.abs(closest_left - timestamp) < Math.abs(closest_right - timestamp)) {

        return closest_left;

    } else {

        return closest_right;

    }

}

function selectedMediaItem(x, y) {

    var result = null;

    var timestamp = xToTime(x);

    for (var i=0;i<items.length;i++) {

        if (timestamp >= items[i].time && timestamp <= items[i].time + items[i].duration && y >= heightOfTrack(items[i].track) && y <= heightOfTrack(items[i].track) + canvas.height/MAX_TIMELINES) {

            result = items[i];

        }

    }

    return result;

}



var canvas_position = canvas.getBoundingClientRect();

function renderTimelines() {

    pixels_per_second = canvas.width / timeline_span;

    //Calculate relevant values
    canvas_position = canvas.getBoundingClientRect();

    //Clear canvas
    pencil.clearRect(0, 0, canvas.width, canvas.height);

    //Display default timeline
    if (timeToX(0) > 0) {

        offset = timeToX(0);

    } else {

        offset = 0;

    }

    pencil.fillStyle = "#757180";
    pencil.fillRect(offset, heightOfTrack(0), canvas.width - offset, canvas.height/MAX_TIMELINES);

    //Display timestamps
    pencil.fillStyle = "#ffffff";
    pencil.strokeStyle = "#ffffff";
    pencil.lineWidth = canvas.height / 400;

    var division = getBestDivision(timeline_span);

    for (var i=division*Math.floor(timeline_start / division); i <= division*Math.ceil((timeline_start + timeline_span) / division); i += division) {

        //Calculate x position
        var x = (i - timeline_start) * pixels_per_second + OFFSET;

        pencil.beginPath();
        pencil.moveTo(x, heightOfTrack(0));
        pencil.lineTo(x, heightOfTrack(0) - 10);

        pencil.stroke();

        pencil.textBaseline = "bottom";
        pencil.textAlign = "center";

        pencil.fillText(timeDisplay(i), x, heightOfTrack(0)-15);

    }

    

    //Render media items
    for (var i=0;i<items.length;i++) {

        items[i].render();

    }

    //Render shadow
    pencil.fillStyle = "#081c07";
    pencil.fillRect(shadow.x - canvas_position.left, heightOfTrack(0), shadow.width*pixels_per_second, canvas.height/MAX_TIMELINES);

}