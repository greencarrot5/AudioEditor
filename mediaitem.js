class MediaItem {

    constructor(file, time, duration) {

        this.file = file;
        this.time = time;
        this.duration = duration;

        this.track = 0;

    }

    render() {

        pencil.fillStyle = "#3fcd37";
        pencil.strokeStyle = "#62ef59";

        var x = (this.time - timeline_start) * pixels_per_second + OFFSET;

        pencil.fillRect(x, heightOfTrack(0), this.duration*pixels_per_second, canvas.height/MAX_TIMELINES);
        pencil.strokeRect(x, heightOfTrack(0), this.duration*pixels_per_second, canvas.height/MAX_TIMELINES);

    }

}