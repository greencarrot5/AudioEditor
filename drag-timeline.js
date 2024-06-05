var dragging_canvas = false;
var clamped_timestamp = 0;

canvas.addEventListener("mousedown", function(e) {

    dragging_canvas = true;

    clamped_timestamp = (e.clientX - canvas_position.left - OFFSET) / pixels_per_second + timeline_start;

});

window.addEventListener("mousemove", function(e) {

    if (dragging_canvas && !moving_item) {

        //Change timeline_start so the cursor keeps clamping the same timestamp
        timeline_start = clamped_timestamp - (e.clientX - canvas_position.left - OFFSET) / pixels_per_second;

        if (timeline_start < 0) {

            timeline_start = 0;

        }

    }

});

window.addEventListener("mouseup", function(e) {

    dragging_canvas = false;

});



window.addEventListener("mousewheel", function(e) {

    var canvas_x = (e.clientX - canvas_position.left - OFFSET);

    var timestamp = canvas_x / pixels_per_second + timeline_start;

    if (e.deltaY < 0) {

        //Zoom in
        timeline_span /= 1.1;

        if (timeline_span < MINIMAL_TIMELINE_SPAN) {

            timeline_span = MINIMAL_TIMELINE_SPAN;

        }

    }

    if (e.deltaY > 0) {

        //Zoom out
        timeline_span *= 1.1;

        if (timeline_span > MAXIMAL_TIMELINE_SPAN) {

            timeline_span = MAXIMAL_TIMELINE_SPAN;

        }

    }

    pixels_per_second = canvas.width / timeline_span;

    timeline_start = timestamp - canvas_x / pixels_per_second;

    if (timeline_start < 0) {

        timeline_start = 0;

    }

});