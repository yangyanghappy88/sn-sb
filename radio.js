let audio = null;
let playlist = [];
let currentIndex = Number(localStorage.getItem("shonenTrack") || 0);
let playlistReady = false;
let audioEventsAttached = false;

const RADIO_DEFAULT_COVER =
  "https://images.chesscomfiles.com/uploads/v1/group/994818.7076cfad.160x160o.be2581528dae@2x.png";

const RADIO_PLAYLIST_URL = `playlist.json?v=${Date.now()}`;

function getAudio() {
  if (!audio || !document.contains(audio)) {
    audio = document.getElementById("audio");
  }

  return audio;
}

function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>'"]/g,
    character =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      })[character]
  );
}

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getTrackCover(track) {
  return track?.cover || RADIO_DEFAULT_COVER;
}

function getTrackTitle(track) {
  return track?.title || "UNTITLED TRANSMISSION";
}

function getTrackArtist(track) {
  return track?.artist || "SHONEN NEXUS RADIO";
}

function getTrackGenre(track) {
  return track?.genre || "ANIME AUDIO";
}

async function loadPlaylist() {
  console.log("SHONEN NEXUS RADIO: loading playlist...");

  try {
    const response = await fetch(RADIO_PLAYLIST_URL, {
      cache: "no-store"
    });

    console.log(
      "SHONEN NEXUS RADIO: playlist response:",
      response.status,
      response.url
    );

    if (!response.ok) {
      throw new Error(`Playlist request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Playlist JSON must contain an array.");
    }

    playlist = data.filter(
      track =>
        track &&
        typeof track.file === "string" &&
        track.file.trim() !== ""
    );

    console.log(
      `SHONEN NEXUS RADIO: ${playlist.length} tracks loaded.`
    );
  } catch (error) {
    console.error(
      "SHONEN NEXUS RADIO playlist error:",
      error
    );

    playlist = [];
  }

  playlistReady = true;

  if (!playlist.length) {
    currentIndex = 0;
  } else if (
    currentIndex < 0 ||
    currentIndex >= playlist.length
  ) {
    currentIndex = 0;
  }

  const player = getAudio();

  if (player && playlist.length) {
    loadTrack(currentIndex, true);
  }

  if (
    location.hash === "#social" &&
    typeof window.renderRadioPage === "function"
  ) {
    window.renderRadioPage();
  }
}

function loadTrack(nextIndex, restoreTime = true) {
  const player = getAudio();

  if (!player || !playlist.length) {
    return;
  }

  currentIndex =
    (Number(nextIndex) + playlist.length) % playlist.length;

  const track = playlist[currentIndex];

  if (!track?.file) {
    return;
  }

  const trackURL = new URL(
    track.file,
    document.baseURI
  ).href;

  console.log(
    "SHONEN NEXUS RADIO: loading track:",
    trackURL
  );

  player.src = trackURL;
  player.load();

  localStorage.setItem(
    "shonenTrack",
    String(currentIndex)
  );

  if (restoreTime) {
    const savedTime = Number(
      localStorage.getItem("shonenTime") || 0
    );

    if (
      Number.isFinite(savedTime) &&
      savedTime > 0
    ) {
      player.addEventListener(
        "loadedmetadata",
        () => {
          if (
            Number.isFinite(player.duration) &&
            savedTime < player.duration
          ) {
            player.currentTime = savedTime;
          }
        },
        { once: true }
      );
    }
  }

  syncRadioUI();
}

function initializeRadio() {
  const player = getAudio();

  if (!player) {
    return false;
  }

  const savedVolume = Number(
    localStorage.getItem("shonenVolume")
  );

  player.volume = Number.isFinite(savedVolume)
    ? Math.min(Math.max(savedVolume, 0), 1)
    : 0.75;

  attachAudioEvents();

  if (
    playlistReady &&
    playlist.length &&
    !player.src
  ) {
    loadTrack(currentIndex, true);
  }

  return true;
}

function toggleRadio() {
  const player = getAudio();

  if (
    !player ||
    !playlistReady ||
    !playlist.length
  ) {
    return;
  }

  if (!player.src) {
    loadTrack(currentIndex, false);
  }

  if (player.paused) {
    player.play().catch(error => {
      console.warn(
        "SHONEN NEXUS RADIO playback blocked:",
        error
      );
    });
  } else {
    player.pause();
  }
}

function syncRadioUI() {
  const player = getAudio();
  const track = playlist[currentIndex];

  const title = document.getElementById("radioTitle");
  const artist = document.getElementById("radioArtist");
  const cover = document.getElementById("radioCover");
  const playButton = document.getElementById("radioPlay");

  if (track) {
    if (title) {
      title.textContent = getTrackTitle(track);
    }

    if (artist) {
      artist.textContent =
        `${getTrackArtist(track)} • ${getTrackGenre(track)}`;
    }

    if (cover) {
      cover.src = getTrackCover(track);

      cover.classList.toggle(
        "playing",
        Boolean(player && !player.paused)
      );
    }
  } else {
    if (title) {
      title.textContent = "NO AUDIO DETECTED";
    }

    if (artist) {
      artist.textContent = "TRANSMISSION QUEUE EMPTY";
    }

    if (cover) {
      cover.src = RADIO_DEFAULT_COVER;
      cover.classList.remove("playing");
    }
  }

  if (playButton) {
    playButton.textContent =
      player && !player.paused
        ? "❚❚ PAUSE"
        : "▶ PLAY";
  }

  document
    .querySelectorAll(".track")
    .forEach((element, index) => {
      element.classList.toggle(
        "active",
        index === currentIndex
      );
    });
}

function renderTrackList() {
  const list = document.getElementById("trackList");

  if (!list) {
    return;
  }

  if (!playlistReady) {
    list.innerHTML = `
      <div class="system-terminal">
        <div class="terminal-line">
          <span class="terminal-prompt">&gt;</span>
          <span class="terminal-muted">
            SCANNING SHONEN AUDIO DATABASE...
          </span>
        </div>
      </div>
    `;

    return;
  }

  if (!playlist.length) {
    list.innerHTML = `
      <div class="system-terminal">
        <div class="terminal-line">
          <span class="terminal-prompt">&gt;</span>
          <span>NO AUDIO DETECTED</span>
        </div>

        <div
          class="terminal-line"
          style="margin-top:8px;"
        >
          <span class="terminal-prompt">&gt;</span>
          <span class="terminal-muted">
            CHECK playlist.json AND music/
          </span>
        </div>
      </div>
    `;

    return;
  }

  list.innerHTML = playlist
    .map((track, index) => {
      const title = escapeHtml(getTrackTitle(track));
      const artist = escapeHtml(getTrackArtist(track));
      const genre = escapeHtml(getTrackGenre(track));
      const cover = escapeHtml(getTrackCover(track));
      const active = index === currentIndex;

      return `
        <button
          class="track ${active ? "active" : ""}"
          data-i="${index}"
          type="button"
        >
          <img
            src="${cover}"
            alt=""
            loading="lazy"
            onerror="this.src='${RADIO_DEFAULT_COVER}'"
          >

          <span>
            <strong>${title}</strong>
            <br>
            <small>${artist} • ${genre}</small>
          </span>

          <span class="track-play-icon">
            ${active ? "●" : "▶"}
          </span>
        </button>
      `;
    })
    .join("");

  list
    .querySelectorAll(".track")
    .forEach(button => {
      button.addEventListener("click", () => {
        const selectedIndex = Number(button.dataset.i);

        loadTrack(selectedIndex, false);

        const player = getAudio();

        if (player) {
          player.play().catch(() => {});
        }
      });
    });
}

function bindRadioControls() {
  const play = document.getElementById("radioPlay");
  const previous = document.getElementById("radioPrev");
  const next = document.getElementById("radioNext");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("radioVolume");
  const player = getAudio();

  if (play) {
    play.onclick = toggleRadio;
  }

  if (previous) {
    previous.onclick = () => {
      if (!playlist.length) {
        return;
      }

      loadTrack(currentIndex - 1, false);

      getAudio()
        ?.play()
        .catch(() => {});
    };
  }

  if (next) {
    next.onclick = () => {
      if (!playlist.length) {
        return;
      }

      loadTrack(currentIndex + 1, false);

      getAudio()
        ?.play()
        .catch(() => {});
    };
  }

  if (progress) {
    progress.oninput = () => {
      const currentPlayer = getAudio();

      if (
        !currentPlayer ||
        !Number.isFinite(currentPlayer.duration) ||
        currentPlayer.duration <= 0
      ) {
        return;
      }

      currentPlayer.currentTime =
        (Number(progress.value) / 100) *
        currentPlayer.duration;
    };
  }

  if (volume) {
    volume.value = String(
      player ? player.volume : 0.75
    );

    volume.oninput = () => {
      const currentPlayer = getAudio();

      if (!currentPlayer) {
        return;
      }

      const newVolume = Math.min(
        Math.max(Number(volume.value), 0),
        1
      );

      currentPlayer.volume = newVolume;

      localStorage.setItem(
        "shonenVolume",
        String(newVolume)
      );
    };
  }
}

function attachAudioEvents() {
  const player = getAudio();

  if (!player || audioEventsAttached) {
    return;
  }

  audioEventsAttached = true;

  player.addEventListener("play", syncRadioUI);
  player.addEventListener("pause", syncRadioUI);

  player.addEventListener("ended", () => {
    if (!playlist.length) {
      return;
    }

    loadTrack(currentIndex + 1, false);

    player.play().catch(() => {});
  });

  player.addEventListener("error", () => {
    const track = playlist[currentIndex];

    console.error(
      "Unable to load Shonen Nexus track:",
      track?.file,
      player.error
    );

    const artist = document.getElementById("radioArtist");

    if (artist) {
      artist.textContent =
        "TRANSMISSION ERROR — CHECK MUSIC FILE.";
    }
  });

  player.addEventListener("timeupdate", () => {
    if (Number.isFinite(player.currentTime)) {
      localStorage.setItem(
        "shonenTime",
        String(Math.floor(player.currentTime))
      );
    }

    const progress = document.getElementById("progress");
    const elapsed = document.getElementById("elapsed");
    const duration = document.getElementById("duration");

    if (
      progress &&
      Number.isFinite(player.duration) &&
      player.duration > 0
    ) {
      progress.value = String(
        (player.currentTime / player.duration) * 100
      );
    }

    if (elapsed) {
      elapsed.textContent = formatTime(
        player.currentTime
      );
    }

    if (duration) {
      duration.textContent = formatTime(
        player.duration
      );
    }
  });

  player.addEventListener("loadedmetadata", () => {
    const duration = document.getElementById("duration");

    if (duration) {
      duration.textContent = formatTime(
        player.duration
      );
    }
  });
}

window.renderRadioPage = function() {
  const player = getAudio();

  if (!player) {
    return;
  }

  initializeRadio();
  renderTrackList();
  bindRadioControls();
  syncRadioUI();
};

window.stopRadioForNavigation = function() {
  const player = getAudio();

  if (player) {
    player.pause();
  }
};

loadPlaylist();