var grabX = 0;
var grabY = 0;

var currentAudioDuration = 0;

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

    shadow = {
        x: e.clientX - grabX,
        y: e.clientY - grabY,

        width: currentAudioDuration,
        height: clientRect.height
    };

}

function dropItem(e) {

    var timestamp = (e.clientX - grabX - canvas_position.left - OFFSET) / pixels_per_second + timeline_start;

    insertMediaItem(new MediaItem(e.srcElement.children[0].files[0], timestamp, shadow.width));

    shadow = {

        x: 0,
        y: 0,

        width: 0,
        height: 0

    };

}