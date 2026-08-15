const Radio = {

    playlist: [],

    currentIndex: 0,

    isPlaying: false,

    shuffle: false,

    repeat: false,

    volume: 0.75,

    audio: null,

    initialized: false

};


/* dom */

const radio$ = selector =>
    document.querySelector(selector);


/* audio */

function initRadioAudio() {
    
    Radio.audio =
        document.createElement("audio");


    Radio.audio.preload =
        "metadata";


    /*
     * Explicitly prevent autoplay.
     */

    Radio.audio.autoplay =
        false;


    Radio.audio.volume =
        Radio.volume;


    /*
     * Useful for browsers / iframe contexts.
     */

    Radio.audio.setAttribute(
        "playsinline",
        ""
    );


    /*
     * Audio events
     */

    Radio.audio.addEventListener(
        "timeupdate",
        updateProgress
    );


    Radio.audio.addEventListener(
        "loadedmetadata",
        updateDuration
    );


    Radio.audio.addEventListener(
        "ended",
        handleTrackEnd
    );


    Radio.audio.addEventListener(
        "play",
        () => {

            Radio.isPlaying = true;

            updatePlayButton();

            updateRadioStatus();

        }
    );


    Radio.audio.addEventListener(
        "pause",
        () => {

            Radio.isPlaying = false;

            updatePlayButton();

            updateRadioStatus();

        }
    );


    Radio.audio.addEventListener(
        "error",
        event => {

            console.error(
                "Radio playback error:",
                event
            );

            updateRadioStatus(
                "ERROR"
            );

        }
    );

}


/* ============================================
   LOAD PLAYLIST
   ============================================ */

async function loadPlaylist() {

    try {

        const response =
            await fetch(
                "playlist.json",
                {
                    cache: "no-cache"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Playlist request failed: ${response.status}`
            );

        }


        const playlist =
            await response.json();


        if (!Array.isArray(playlist)) {

            throw new Error(
                "playlist.json must contain an array."
            );

        }


        Radio.playlist =
            playlist.filter(track => {

                return (
                    track &&
                    typeof track.file === "string"
                );

            });


        if (!Radio.playlist.length) {

            throw new Error(
                "Playlist contains no valid tracks."
            );

        }


        loadTrack(0);

        updatePlaylistUI();

        updateRadioStatus(
            "READY"
        );


    } catch (error) {

        console.error(
            "Could not load radio playlist:",
            error
        );


        updateRadioStatus(
            "OFFLINE"
        );

    }

}


/* ============================================
   LOAD TRACK
   ============================================ */

function loadTrack(index) {

    if (!Radio.playlist.length) {
        return;
    }


    /*
     * Keep the index inside playlist bounds.
     */

    if (
        index < 0 ||
        index >= Radio.playlist.length
    ) {

        index = 0;

    }


    Radio.currentIndex =
        index;


    const track =
        Radio.playlist[
            Radio.currentIndex
        ];


    /*
     * Stop the old track before changing
     * the source.
     */

    if (Radio.audio) {

        Radio.audio.pause();

        Radio.audio.currentTime = 0;

        Radio.audio.src =
            encodeURI(track.file);

    }


    updateTrackInfo();

    updatePlaylistUI();

    resetProgress();

}


/* ============================================
   PLAY
   ============================================ */

async function playRadio() {

    if (!Radio.audio) {
        return;
    }


    if (!Radio.playlist.length) {
        return;
    }


    /*
     * User interaction occurs here, so the
     * browser permits playback.
     */

    try {

        await Radio.audio.play();

    } catch (error) {

        console.error(
            "Could not start radio:",
            error
        );

        updateRadioStatus(
            "PRESS PLAY"
        );

    }

}


/* ============================================
   PAUSE
   ============================================ */

function pauseRadio() {

    if (!Radio.audio) {
        return;
    }


    Radio.audio.pause();

}


/* ============================================
   TOGGLE PLAYBACK
   ============================================ */

function toggleRadio() {

    if (Radio.isPlaying) {

        pauseRadio();

    } else {

        playRadio();

    }

}


/* ============================================
   NEXT TRACK
   ============================================ */

function nextTrack() {

    if (!Radio.playlist.length) {
        return;
    }


    let nextIndex;


    if (Radio.shuffle) {

        nextIndex =
            getRandomTrackIndex();

    } else {

        nextIndex =
            Radio.currentIndex + 1;


        if (
            nextIndex >=
            Radio.playlist.length
        ) {

            nextIndex = 0;

        }

    }


    loadTrack(nextIndex);


    /*
     * Only continue playback if the radio
     * was already playing.
     */

    if (Radio.isPlaying) {

        playRadio();

    }

}


/* ============================================
   PREVIOUS TRACK
   ============================================ */

function previousTrack() {

    if (!Radio.playlist.length) {
        return;
    }


    /*
     * If we're more than 3 seconds into the
     * track, restart it instead.
     */

    if (
        Radio.audio &&
        Radio.audio.currentTime > 3
    ) {

        Radio.audio.currentTime = 0;

        return;

    }


    let previousIndex =
        Radio.currentIndex - 1;


    if (previousIndex < 0) {

        previousIndex =
            Radio.playlist.length - 1;

    }


    loadTrack(previousIndex);


    if (Radio.isPlaying) {

        playRadio();

    }

}


/* ============================================
   RANDOM TRACK
   ============================================ */

function getRandomTrackIndex() {

    if (Radio.playlist.length <= 1) {

        return Radio.currentIndex;

    }


    let randomIndex;


    do {

        randomIndex =
            Math.floor(
                Math.random() *
                Radio.playlist.length
            );

    } while (
        randomIndex ===
        Radio.currentIndex
    );


    return randomIndex;

}


/* ============================================
   TRACK END
   ============================================ */

function handleTrackEnd() {

    /*
     * Repeat current track.
     */

    if (Radio.repeat) {

        Radio.audio.currentTime = 0;

        playRadio();

        return;

    }


    /*
     * Otherwise advance normally.
     */

    nextTrack();

}


/* ============================================
   SHUFFLE
   ============================================ */

function toggleShuffle() {

    Radio.shuffle =
        !Radio.shuffle;


    const button =
        radio$('[data-radio="shuffle"]');


    if (button) {

        button.classList.toggle(
            "active",
            Radio.shuffle
        );

    }

}


/* ============================================
   REPEAT
   ============================================ */

function toggleRepeat() {

    Radio.repeat =
        !Radio.repeat;


    const button =
        radio$('[data-radio="repeat"]');


    if (button) {

        button.classList.toggle(
            "active",
            Radio.repeat
        );

    }

}


/* ============================================
   VOLUME
   ============================================ */

function setVolume(value) {

    if (!Radio.audio) {
        return;
    }


    let volume =
        Number(value);


    if (Number.isNaN(volume)) {
        return;
    }


    /*
     * Support both:
     *
     * 0 → 1
     *
     * 0 → 100
     */

    if (volume > 1) {

        volume =
            volume / 100;

    }


    volume =
        Math.max(
            0,
            Math.min(1, volume)
        );


    Radio.volume =
        volume;


    Radio.audio.volume =
        volume;


    localStorage.setItem(
        "shonen-radio-volume",
        String(volume)
    );


    updateVolumeUI();

}


/* ============================================
   RESTORE VOLUME
   ============================================ */

function restoreVolume() {

    const saved =
        localStorage.getItem(
            "shonen-radio-volume"
        );


    if (saved !== null) {

        const volume =
            Number(saved);


        if (!Number.isNaN(volume)) {

            Radio.volume =
                Math.max(
                    0,
                    Math.min(1, volume)
                );

        }

    }


    if (Radio.audio) {

        Radio.audio.volume =
            Radio.volume;

    }


    updateVolumeUI();

}


/* ============================================
   PROGRESS
   ============================================ */

function updateProgress() {

    if (!Radio.audio) {
        return;
    }


    const progress =
        radio$('[data-radio="progress"]');


    if (!progress) {
        return;
    }


    if (
        !Radio.audio.duration ||
        !Number.isFinite(
            Radio.audio.duration
        )
    ) {

        progress.value = 0;

        return;

    }


    progress.value =
        (
            Radio.audio.currentTime /
            Radio.audio.duration
        ) * 100;

}


/* ============================================
   SEEK
   ============================================ */

function seekRadio(value) {

    if (!Radio.audio) {
        return;
    }


    if (
        !Radio.audio.duration ||
        !Number.isFinite(
            Radio.audio.duration
        )
    ) {

        return;

    }


    const percentage =
        Number(value) / 100;


    Radio.audio.currentTime =
        Radio.audio.duration *
        percentage;

}


/* ============================================
   RESET PROGRESS
   ============================================ */

function resetProgress() {

    const progress =
        radio$('[data-radio="progress"]');


    if (progress) {

        progress.value = 0;

    }


    const current =
        radio$('[data-radio="current-time"]');


    if (current) {

        current.textContent =
            "0:00";

    }

}


/* ============================================
   DURATION
   ============================================ */

function updateDuration() {

    if (!Radio.audio) {
        return;
    }


    const duration =
        radio$('[data-radio="duration"]');


    if (!duration) {
        return;
    }


    duration.textContent =
        formatTime(
            Radio.audio.duration
        );

}


/* ============================================
   TIME DISPLAY
   ============================================ */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        Math.floor(
            seconds % 60
        );


    return `${minutes}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;

}


/* ============================================
   UPDATE CURRENT TIME
   ============================================ */

function updateCurrentTime() {

    if (!Radio.audio) {
        return;
    }


    const current =
        radio$('[data-radio="current-time"]');


    if (current) {

        current.textContent =
            formatTime(
                Radio.audio.currentTime
            );

    }

}


/* ============================================
   TRACK INFORMATION
   ============================================ */

function updateTrackInfo() {

    const track =
        Radio.playlist[
            Radio.currentIndex
        ];


    if (!track) {
        return;
    }


    const title =
        radio$('[data-radio="title"]');


    const artist =
        radio$('[data-radio="artist"]');


    if (title) {

        title.textContent =
            track.title ||
            "Unknown Track";

    }


    if (artist) {

        artist.textContent =
            track.artist ||
            "Unknown Artist";

    }


    const number =
        radio$('[data-radio="track-number"]');


    if (number) {

        number.textContent =
            `${Radio.currentIndex + 1} / ${Radio.playlist.length}`;

    }

}


/* ============================================
   PLAY BUTTON
   ============================================ */

function updatePlayButton() {

    const buttons =
        $$('[data-radio="play"]');


    buttons.forEach(button => {

        button.textContent =
            Radio.isPlaying
                ? "Ⅱ"
                : "▶";


        button.setAttribute(
            "aria-label",
            Radio.isPlaying
                ? "Pause"
                : "Play"
        );

    });

}


/* ============================================
   STATUS
   ============================================ */

function updateRadioStatus(
    status = null
) {

    const element =
        radio$('[data-radio="status"]');


    if (!element) {
        return;
    }


    if (!status) {

        status =
            Radio.isPlaying
                ? "PLAYING"
                : "PAUSED";

    }


    element.textContent =
        status;

}


/* ============================================
   VOLUME UI
   ============================================ */

function updateVolumeUI() {

    const volume =
        radio$('[data-radio="volume"]');


    if (!volume) {
        return;
    }


    volume.value =
        Radio.volume * 100;

}


/* ============================================
   PLAYLIST UI
   ============================================ */

function updatePlaylistUI() {

    const container =
        radio$('[data-radio="playlist"]');


    if (!container) {
        return;
    }


    container.innerHTML = "";


    Radio.playlist.forEach(
        (track, index) => {

            const item =
                document.createElement("button");


            item.type =
                "button";


            item.className =
                "radio-track";


            item.dataset.index =
                index;


            item.innerHTML = `

                <span class="radio-track-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="radio-track-info">

                    <strong>
                        ${escapeHTML(
                            track.title ||
                            "Unknown Track"
                        )}
                    </strong>

                    <small>
                        ${escapeHTML(
                            track.artist ||
                            "Unknown Artist"
                        )}
                    </small>

                </span>

            `;


            item.addEventListener(
                "click",
                () => {

                    const wasPlaying =
                        Radio.isPlaying;


                    loadTrack(index);


                    if (wasPlaying) {

                        playRadio();

                    }

                }
            );


            container.appendChild(
                item
            );

        }
    );


    highlightCurrentTrack();

}


/* ============================================
   HIGHLIGHT CURRENT TRACK
   ============================================ */

function highlightCurrentTrack() {

    $$(
        '[data-radio="playlist"] .radio-track'
    ).forEach(item => {

        item.classList.toggle(
            "active",
            Number(item.dataset.index) ===
            Radio.currentIndex
        );

    });

}


/* ============================================
   ESCAPE HTML
   ============================================ */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ============================================
   BIND RADIO CONTROLS
   ============================================ */

function bindRadioControls() {

    /*
     * Play
     */

    $$('[data-radio="play"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleRadio
            );

        });


    /*
     * Previous
     */

    $$('[data-radio="previous"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                previousTrack
            );

        });


    /*
     * Next
     */

    $$('[data-radio="next"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                nextTrack
            );

        });


    /*
     * Shuffle
     */

    $$('[data-radio="shuffle"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleShuffle
            );

        });


    /*
     * Repeat
     */

    $$('[data-radio="repeat"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleRepeat
            );

        });


    /*
     * Progress
     */

    $$('[data-radio="progress"]')
        .forEach(input => {

            input.addEventListener(
                "input",
                event => {

                    seekRadio(
                        event.target.value
                    );

                }
            );

        });


    /*
     * Volume
     */

    $$('[data-radio="volume"]')
        .forEach(input => {

            input.addEventListener(
                "input",
                event => {

                    setVolume(
                        event.target.value
                    );

                }
            );

        });

}


/* ============================================
   RADIO CLOCK
   ============================================ */

function startRadioClock() {

    setInterval(
        updateCurrentTime,
        500
    );

}


/* ============================================
   RADIO INITIALIZATION
   ============================================ */

async function initRadio() {

    /*
     * Only initialize if the page actually
     * contains radio controls.
     */

    const radio =
        document.querySelector(
            "[data-radio-player]"
        );


    if (!radio) {
        return;
    }


    if (Radio.initialized) {
        return;
    }


    Radio.initialized =
        true;


    initRadioAudio();

    restoreVolume();

    bindRadioControls();

    startRadioClock();

    await loadPlaylist();

}


/* ============================================
   GLOBAL RADIO API
   ============================================ */

window.ShonenRadio = {

    play:
        playRadio,

    pause:
        pauseRadio,

    toggle:
        toggleRadio,

    next:
        nextTrack,

    previous:
        previousTrack,

    shuffle:
        toggleShuffle,

    repeat:
        toggleRepeat,

    volume:
        setVolume,

    seek:
        seekRadio,

    getState: () => ({
        currentIndex:
            Radio.currentIndex,

        isPlaying:
            Radio.isPlaying,

        shuffle:
            Radio.shuffle,

        repeat:
            Radio.repeat,

        volume:
            Radio.volume
    })

};


/* ============================================
   START RADIO
   ============================================ */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initRadio
    );

} else {

    initRadio();

}