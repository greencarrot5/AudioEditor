class MediaItem {

    constructor(file, time, duration) {

        this.file = file;
        this.time = time;
        this.duration = duration;

        this.track = 0;

        this.audioElement = document.createElement("audio");
        this.audioElement.setAttribute("src", URL.createObjectURL(this.file));

        this.soundtrack = audioContext.createMediaElementSource(this.audioElement);

        this.soundtrack.connect(audioContext.destination);

    }

    render() {

        if (currentlySelected.includes(this)) {

            pencil.fillStyle = "#6ffd67";

        } else {

            pencil.fillStyle = "#3fcd37";

        }

        pencil.strokeStyle = "#62ef59";

        var x = (this.time - timeline_start) * pixels_per_second + OFFSET;

        pencil.fillRect(x, heightOfTrack(0), this.duration*pixels_per_second, canvas.height/MAX_TIMELINES);
        pencil.strokeRect(x, heightOfTrack(0), this.duration*pixels_per_second, canvas.height/MAX_TIMELINES);

    }

    play(time=0) {

        this.audioElement.currentTime = time;

        this.audioElement.play();

    }

    stop() {

        this.audioElement.pause();

    }

    getBuffer(context) {

        return fetch(this.audioElement.src).then(
            (response) => response.arrayBuffer()
        ).then(
            (buffer) => {return context.decodeAudioData(buffer)}
        );

    }

}