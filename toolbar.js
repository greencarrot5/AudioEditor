class BinaryWriter {

    constructor() {

        this.arr = [];

    }

    writeInt(num, size) {

        var remaining = Math.floor(num);

        for (var i=0;i<size;i++) {

            var part = Math.floor(remaining / (256 ** (size-i-1)));

            remaining -= part * (256 ** (size-i-1));

            this.arr.push(part);

        }

    }

    writeStr(str) {

        for (var i=0;i<str.length;i++) {

            this.arr.push(str[i].charCodeAt(0));

        }

    }

    writeBuffer(buffer) {

        for (var i=0;i<buffer.byteLength;i++) {

            this.arr.push(buffer[i]);

        }

    }

    getBuffer() {

        this.uint8array = new Uint8Array(this.arr.length);

        for (var i=0;i<this.arr.length;i++) {

            this.uint8array[i] = this.arr[i];

        }

        return this.uint8array.buffer;

    }

}

class BinaryReader {

    constructor(buffer) {

        this.buffer = buffer;
        this.uint8array = new Uint8Array(buffer);

        this.offset = 0;

    }

    readInt(bytes) {

        //Big endian

        var total = 0;

        for (var i=this.offset;i<this.offset+bytes;i++) {

            total *= 256;

            total += this.uint8array[i];

        }

        this.offset += bytes;

        return total;

    }

    readStr(bytes) {

        var result = "";

        for (var i=this.offset;i<this.offset+bytes;i++) {

            result += String.fromCharCode(this.uint8array[i]);

        }

        this.offset += bytes;

        return result;

    }

    readBuffer(bytes) {

        var arr = [];

        for (var i=this.offset;i<this.offset+bytes;i++) {

            arr.push(this.uint8array[i]);

        }

        var buffer = new Uint8Array(arr.length);

        for (var i=0;i<arr.length;i++) {

            buffer[i] = arr[i];

        }

        this.offset += bytes;

        return buffer;

    }

}

//Thanks, ChatGPT
function readFile(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(event) {

            resolve(event.target.result);

        };

        reader.onerror = function(event) {

            reject(new Error("Error reading file: " + event.target.error.code));

        };

        reader.readAsArrayBuffer(file);

    });

}

async function saveProject() {

    var imported = [];

    for (var i=0;i<document.getElementById("media-list").children.length;i++) {

        var current = document.getElementById("media-list").children[i].children[0];

        var name = current.files[0].name;

        var content = new Uint8Array(await readFile(current.files[0]));

        imported.push({"name": name, "content": content});

    }

    var bytes = new BinaryWriter();

    //Write file
    bytes.writeInt(AEPS_PROTOCOL_VERSION, 1);

    bytes.writeInt(imported.length, 2);

    for (var i=0;i<imported.length;i++) {

        bytes.writeInt(imported[i].name.length, 2);

        bytes.writeStr(imported[i].name);

        bytes.writeInt(imported[i].content.byteLength, 8);

        bytes.writeBuffer(imported[i].content);

    }

    bytes.writeInt(items.length, 2);

    for (var i=0;i<items.length;i++) {

        var name = items[i].file.name;

        var content = new Uint8Array(await readFile(items[i].file));

        bytes.writeInt(name.length, 2);

        bytes.writeStr(name);

        bytes.writeInt(content.byteLength, 8);

        bytes.writeBuffer(content);

        bytes.writeInt(items[i].time * 1000000, 5);

        bytes.writeInt(items[i].duration * 1000000, 5);

    }

    //Download file
    var blob = new Blob([bytes.getBuffer()]);

    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");

    a.href = url;

    a.download = "project.aeps";

    a.click();

    window.URL.revokeObjectURL(url);

}

function openProject() {

    if (!(items.length == 0 || confirm("Importing will delete all current items."))) {

        return;

    }

    var input = document.createElement("input");

    input.type = "file";
    input.display = "none";
    input.setAttribute("accept", ".aeps");

    input.onchange = function(e) {

        loadFile(input.files[0]);

    }

    input.click();

}

async function loadFile(file) {

    var buffer = await file.arrayBuffer();

    var bytes = new BinaryReader(buffer);

    var protocol_version = bytes.readInt(1);

    if (protocol_version == 1) {

        var imported_amount = bytes.readInt(2);

        //Clear imports
        document.getElementById("media-list").innerHTML = "";

        for (var i=0;i<imported_amount;i++) {

            var namelength = bytes.readInt(2);

            var name = bytes.readStr(namelength);

            var length = bytes.readInt(8);

            var content = bytes.readBuffer(length);

            var input = document.createElement("input");

            input.type = "file";
            input.display = "none";

            var blob = new Blob([content], {type: "audio/mpeg"});

            var file = new File([blob], name, {type: "audio/mpeg"});

            var datatransfer = new DataTransfer();

            datatransfer.items.add(file);

            input.files = datatransfer.files;

            addMediaItem(input);

        }

        //Clear items in timeline
        items = [];

        var item_amount = bytes.readInt(2);

        for (var i=0;i<item_amount;i++) {

            var namelength = bytes.readInt(2);

            var name = bytes.readStr(namelength);

            var length = bytes.readInt(8);

            var content = bytes.readBuffer(length);

            var timestamp = bytes.readInt(5) / 1000000;
            var duration = bytes.readInt(5) / 1000000;

            var input = document.createElement("input");

            input.type = "file";
            input.display = "none";

            var blob = new Blob([content], {type: "audio/mpeg"});

            var file = new File([blob], name, {type: "audio/mpeg"});

            var datatransfer = new DataTransfer();

            datatransfer.items.add(file);

            input.files = datatransfer.files;

            items.push(new MediaItem(input, timestamp, duration));

        }

    } else {

        alert("Protocol version up to " + AEPS_PROTOCOL_VERSION + " supported, not " + protocol_version + ".");

    }

}