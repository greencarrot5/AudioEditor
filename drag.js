var grabX = 0;
var grabY = 0;

var currentAudioDuration = 0;

window.addEventListener("dragstart", function(e) {

    if (e.srcElement.getAttribute("id") == "media-list" || e.srcElement.getAttribute("id") == "options" || e.srcElement.tagName == "canvas") {

        e.preventDefault();
        return;

    }

});

function pickItem(e) {

    grabX = e.offsetX;
    grabY = e.offsetY;

    var reader = new FileReader();

    var audio = document.createElement("audio");

    reader.onload = function(ev) {

        audio.src = ev.target.result;

        audio.addEventListener("durationchange", function() {

            currentAudioDuration = audio.duration;
            
        });

    }

    reader.readAsDataURL(e.srcElement.children[0].files[0]);

}

function dragItem(e) {

    var clientRect = e.srcElement.getBoundingClientRect();

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
        height: clientRect.height
    };

}



function dropItem(e) {

    var hovered_timestamp = (e.clientX - grabX - canvas_position.left - OFFSET) / pixels_per_second + timeline_start;

    var timestamp = closestTimestamp(hovered_timestamp, currentAudioDuration);

    var media_item = new MediaItem(e.srcElement.children[0], timestamp, currentAudioDuration);

    insertMediaItem(media_item);

    addAction(Action.ADD_MEDIA, {item: media_item});

    shadow = {

        x: 0,
        y: 0,

        width: 0,
        height: 0

    };

}