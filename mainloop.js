function mainloop() {

    renderTimelines();
    renderCursor();
    
    playAudio();

    window.requestAnimationFrame(mainloop);

}

mainloop();