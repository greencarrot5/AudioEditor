function importMedia() {

    var fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.display = "none";

    fileInput.onchange = function(e) {

        addMediaItem(fileInput);

    }

    fileInput.click();

}

function addMediaItem(inputElement) {

    var div = document.createElement("div");

    div.className = "media-item";

    div.innerText = inputElement.files[0].name;

    document.getElementById("media-list").appendChild(div);

    div.appendChild(inputElement);

    inputElement.style.display = "none";

    makeDraggable(div);

}