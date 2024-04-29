var draggingObject = null;

function makeDraggable(element) {

    element.onmousedown = function(e) {

        var copy = document.createElement("div");
        copy.className = "media-item-drag";

        copy.innerText = "Hello world!";

        copy.style.top = element.offsetTop + "px";
        copy.style.left = element.offsetLeft + "px";

        copy.style.width = element.width;
        copy.style.height = element.height;

        document.body.appendChild(copy);

    }

}