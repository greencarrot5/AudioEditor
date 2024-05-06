//Manages the canvas rendering of timelines
var canvas = document.createElement("canvas");
canvas.width = window.innerWidth - document.getElementById("media").getBoundingClientRect().width - document.getElementById("options").getBoundingClientRect().width;
canvas.height = window.innerHeight - document.getElementById("header").getBoundingClientRect().height;
document.getElementById("timeline").appendChild(canvas);
var pencil = canvas.getContext("2d");

window.onresize = function(e) {

    canvas.width = window.innerWidth - document.getElementById("media").getBoundingClientRect().width - document.getElementById("options").getBoundingClientRect().width;
    canvas.height = window.innerHeight - document.getElementById("header").getBoundingClientRect().height;

}

window.onmousewheel = function(e) {

    if (e.deltaY < 0) {

        //Zoom in
        timeline_span /= 1.1;

        if (timeline_span < MINIMAL_TIMELINE_SPAN) {

            timeline_span = MINIMAL_TIMELINE_SPAN;

        }

    }

    if (e.deltaY > 0) {

        //Zoom out
        timeline_span *= 1.1

        if (timeline_span > MAXIMAL_TIMELINE_SPAN) {

            timeline_span = MAXIMAL_TIMELINE_SPAN;

        }

    }

}

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

        remainder = "0" + remainder

    }

    return Math.floor(seconds / 60) + ":" + remainder;

}

var canvas_position = canvas.getBoundingClientRect();

function renderTimelines() {

    pixels_per_second = canvas.width / timeline_span;

    //Calculate relevant values
    canvas_position = canvas.getBoundingClientRect();

    //Clear canvas
    pencil.clearRect(0, 0, canvas.width, canvas.height);

    //Display default timeline
    pencil.fillStyle = "#757180";
    pencil.fillRect(OFFSET, heightOfTrack(0), canvas.width - OFFSET, canvas.height/MAX_TIMELINES);

    //Display timestamps
    pencil.fillStyle = "#ffffff";
    pencil.strokeStyle = "#ffffff";

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

    //Render shadow
    pencil.fillStyle = "#081c07";
    pencil.fillRect(shadow.x - canvas_position.left, heightOfTrack(0), shadow.width*pixels_per_second, canvas.height/MAX_TIMELINES);

    //Render media items
    for (var i=0;i<items.length;i++) {

        items[i].render();

    }

    window.requestAnimationFrame(renderTimelines);

}

renderTimelines();