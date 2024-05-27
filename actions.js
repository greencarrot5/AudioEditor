//Action enum
const Action = {
    ADD_MEDIA: "add media", //{item}
    REMOVE_MEDIA: "remove media" //{item}
};

var actions = [];
var actions_index = 0;

var ctrl_pressed = false;

function addAction(type, data) {

    //Remove future stored actions, we're in a different timeline now
    actions.splice(actions_index+1, actions.length-(actions_index+1));

    actions[actions_index] = {type: type, data: data};

    actions_index++;

}

function undoAction() {

    if (actions_index == 0) {
        return; //Nothing to undo
    }

    actions_index--;

    var action = actions[actions_index];

    switch(action.type) {

        case Action.ADD_MEDIA:
            var index = items.indexOf(action.data.item);

            items.splice(index, 1);
            break;

        case Action.REMOVE_MEDIA:
            insertMediaItem(action.data.item);
            break;

        default:
            console.error('Invalid action type "' + action.type + '"');

    }

}

function redoAction() {

    if (actions_index == actions.length) {

        return; //Nothing to redo

    }

    var action = actions[actions_index];

    switch(action.type) {
        
        case Action.ADD_MEDIA:
            insertMediaItem(action.data.item);
            break;

        case Action.REMOVE_MEDIA:
            var index = items.indexOf(action.data.item);

            items.splice(index, 1);
            break;

        default:
            console.error('Invalid action type "' + action.type + '"');

    }

    actions_index++;

}

window.addEventListener("keydown", function(e) {

    if (e.key == "Control") {

        ctrl_pressed = true;

    }

    if (e.key == "z" && ctrl_pressed) {

        undoAction();

    }

    if (e.key == "y" && ctrl_pressed) {

        redoAction();

    }

});

window.addEventListener("keyup", function(e) {

    if (e.key == "Control") {

        ctrl_pressed = false;

    }

})