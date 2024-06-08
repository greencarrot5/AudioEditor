var audioContext;

window.addEventListener("click", function(e) {

    if (audioContext == null) {

        audioContext = new AudioContext();

    }

});

window.addEventListener("keydown", function(e) {

    if (audioContext == null) {

        audioContext = new AudioContext();

    }

});

var cursor_timestamp = 0;
var lastMouseDown = 0;

function renderCursor() {

    var x = timeToX(cursor_timestamp);

    pencil.strokeStyle = "#3333ff";
    pencil.lineWidth = canvas.height / 200;

    pencil.beginPath();
    pencil.moveTo(x, (canvas.height - CURSOR_SIZE*(canvas.height/MAX_TIMELINES)) / 2);
    pencil.lineTo(x, (canvas.height + CURSOR_SIZE*(canvas.height/MAX_TIMELINES)) / 2);

    pencil.stroke();

}

canvas.addEventListener("mousedown", function(e) {

    lastMouseDown = Date.now();

});

canvas.addEventListener("mouseup", function(e) {

    if (Date.now() - lastMouseDown > CLICK_TIME*1000) {

        return;

    }

    if (selectedMediaItem(e.pageX - canvas_position.left, e.pageY - canvas_position.top)) {

        return;
        
    }

    cursor_timestamp = Math.max(0, xToTime(e.clientX - canvas_position.left));

    if (audioPlaying) {

        stopAudioPlay();
        previousCursorTimestamp = -1;

        originalCursorTimestamp = cursor_timestamp;

    }

});

var audioPlaying = false;

var lastAudioPlayFrame = 0;

var originalCursorTimestamp = 0;
var previousCursorTimestamp = -1;

function stopAudioPlay() {

    //Stop all sounds
    for (var i=0;i<items.length;i++) {

        items[i].stop();

    }

}

window.addEventListener("keydown", function(e) {

    if (e.key == " ") {

        if (audioPlaying) {

            stopAudioPlay();

            cursor_timestamp = originalCursorTimestamp;

        } else {

            lastAudioPlayFrame = Date.now();

            originalCursorTimestamp = cursor_timestamp;
            previousCursorTimestamp = -1;

        }

        audioPlaying = !audioPlaying;

    }

});

function playAudio() {

    if (audioPlaying) {

        var now = Date.now();

        cursor_timestamp += (now - lastAudioPlayFrame) / 1000;

        //Check for new mediafiles
        for (var i=0;i<items.length;i++) {

            if ((cursor_timestamp >= items[i].time && cursor_timestamp < items[i].time + items[i].duration) && !(previousCursorTimestamp >= items[i].time && previousCursorTimestamp < items[i].time + items[i].duration)) {

                items[i].play(cursor_timestamp - items[i].time);

            }

        }

        previousCursorTimestamp = cursor_timestamp;

        lastAudioPlayFrame = now;

    }

}