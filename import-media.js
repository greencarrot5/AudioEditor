function importMedia() {

    var acceptList = "." + SUPPORTED_EXTENSIONS[0];

    for (var i=1;i<SUPPORTED_EXTENSIONS.length;i++) {

        acceptList += ",." + SUPPORTED_EXTENSIONS[i];

    }

    var fileInput = document.createElement("input");

    fileInput.type = "file";
    fileInput.display = "none";
    fileInput.setAttribute("accept", acceptList);

    fileInput.onchange = function(e) {

        addMediaItem(fileInput);

    }

    fileInput.click();

}

function addMediaItem(inputElement) {

    var extension = inputElement.files[0].name.split(".").pop();

    if (!SUPPORTED_EXTENSIONS.includes(extension)) {

        alert("." + extension + " files are not supported.");

        return;

    }

    var div = document.createElement("div");

    div.className = "media-item";

    div.innerText = inputElement.files[0].name;

    div.draggable = true;

    //Add event listeners
    div.addEventListener("drag", dragItem);
    div.addEventListener("dragend", dropItem);
    div.addEventListener("dragstart", pickItem);

    document.getElementById("media-list").appendChild(div);

    div.appendChild(inputElement);

    inputElement.style.display = "none";

}