var currentlySelected = [];

canvas.addEventListener("click", function(e) {

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