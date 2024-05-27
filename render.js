async function render() {

    //Check if audioContext exists
    if (audioContext == null) {

        audioContext = new AudioContext();

    }

    //Calculate total duration
    var totalDuration = 0;

    for (var i=0;i<items.length;i++) {

        totalDuration = Math.max(totalDuration, items[i].time + items[i].duration);

    }

    if (totalDuration == 0) {

        return;

    }

    document.getElementById("rendering-progress-message").innerHTML = "0.0%";

    document.getElementById("rendering-progress").style.display = "block";

    var c = document.getElementById("rendering-progress-canvas");

    var pc = c.getContext("2d");

    pc.clearRect(0, 0, c.width, c.height);

    var sampleRate = 44100;

    //Create new audiocontext
    var offlineContext = new OfflineAudioContext(2, totalDuration*sampleRate, sampleRate);

    //Add buffers to offlineContext
    for (var i=0;i<items.length;i++) {

        var source = offlineContext.createBufferSource();

        source.buffer = await items[i].getBuffer(offlineContext);

        source.connect(offlineContext.destination);

        source.start(items[i].time);

    }

    offlineContext.startRendering().then((buffer) => {

        audioEncoder(buffer, 128,
            function onprogress(progress) {

                document.getElementById("rendering-progress-message").innerHTML = Math.floor(1000 * progress) / 10 + "%";

                pc.clearRect(0, 0, c.width, c.height);

                pc.fillStyle = "#00bb00";

                pc.fillRect(0, 0, progress*c.width, c.height);

            },

            function saveFile(blob) {

                var url = window.URL.createObjectURL(blob);

                var a = document.createElement("a");

                a.href = url;

                a.download = "result.mp3";

                a.click();

                window.URL.revokeObjectURL(url);

                document.getElementById("rendering-progress").style.display = "none";

            }
        
        );

    });

}