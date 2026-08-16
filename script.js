const SHONEN_NEXUS = {
  clubUrl:
    "https://www.chess.com/club/shonen-nexus",

  inviteUrl:
    "https://www.chess.com/club/shonen-nexus/join?utm_campaign=club_invite_link&utm_source=chesscom&utm_medium=copy",

  logoUrl:
    "https://images.chesscomfiles.com/uploads/v1/group/994818.7076cfad.160x160o.be2581528dae@2x.png",

  themes: [
    "default",
    "windbreaker",
    "cote",
    "bleach",
    "jjk",
    "naruto",
    "onepiece"
  ],

  sections: [
    "home",
    "registry",
    "command",
    "social",
    "calendar"
  ]
};


/* =========================
   DOM HELPERS
   ========================= */

const $ = (
  selector,
  parent = document
) =>
  parent.querySelector(selector);

const $$ = (
  selector,
  parent = document
) =>
  [...parent.querySelectorAll(selector)];


/* =========================
   STATE
   ========================= */

const SHONEN_STATE = {
  currentSection: "home",
  bootTimer: null,
  welcomeTimer: null
};


/* =========================
   CORE ELEMENTS
   ========================= */

const app = $("#app");
const sidebar = $("#sidebar");
const navToggle = $("#navToggle");
const navOverlay = $("#navOverlay");


/* =========================
   UTILITIES
   ========================= */

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

function systemHeader(
  kicker,
  title,
  description
) {
  return `
    <header class="system-page-header">
      <div class="system-kicker">
        ${escapeHtml(kicker)}
      </div>

      <h1>
        ${escapeHtml(title)}
      </h1>

      <p>
        ${escapeHtml(description)}
      </p>
    </header>
  `;
}


/* =========================
   NAVIGATION
   ========================= */

function openSidebar() {
  sidebar?.classList.add("open");
  navToggle?.classList.add("active");

  navToggle?.setAttribute(
    "aria-expanded",
    "true"
  );

  navToggle?.setAttribute(
    "aria-label",
    "Close navigation"
  );

  document.body.classList.add("nav-open");
  navOverlay?.classList.add("active");
}

function closeSidebar() {
  sidebar?.classList.remove("open");
  navToggle?.classList.remove("active");

  navToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

  navToggle?.setAttribute(
    "aria-label",
    "Open navigation"
  );

  document.body.classList.remove("nav-open");
  navOverlay?.classList.remove("active");
}

function toggleSidebar() {
  if (
    sidebar?.classList.contains("open")
  ) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function getRoute() {
  const requested = (
    location.hash || "#home"
  )
    .replace("#", "")
    .trim()
    .toLowerCase();

  return SHONEN_NEXUS.sections.includes(
    requested
  )
    ? requested
    : "home";
}

function updateNavigation(section) {
  $$(".nav-item, .main-nav a").forEach(
    link => {
      const href =
        link.getAttribute("href") || "";

      const target = href
        .replace("#", "")
        .trim()
        .toLowerCase();

      link.classList.toggle(
        "active",
        target === section
      );
    }
  );
}

function initNavigation() {
  if (!navToggle || !sidebar) {
    console.warn(
      "Shonen Nexus navigation elements not found."
    );

    return;
  }

  navToggle.addEventListener(
    "click",
    toggleSidebar
  );

  navOverlay?.addEventListener(
    "click",
    closeSidebar
  );

  $$(".nav-item, .main-nav a").forEach(
    link => {
      link.addEventListener(
        "click",
        () => {
          if (
            window.matchMedia(
              "(max-width: 899px)"
            ).matches
          ) {
            closeSidebar();
          }
        }
      );
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    }
  );

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 900) {
        closeSidebar();
      }
    }
  );
}


/* =========================
   WELCOME
   ========================= */

function createWelcomeScreen() {
  if ($("#welcomeScreen")) {
    return;
  }

  const screen =
    document.createElement("div");

  screen.id =
    "welcomeScreen";

  screen.className =
    "welcome-screen";

  screen.innerHTML = `
    <div class="welcome-content">

      <p>
        SHONEN NEXUS
      </p>

      <h2>
        WELCOME TO THE NEXUS
      </h2>

      <p>
        ANIME × CHESS × COMMUNITY
      </p>

    </div>
  `;

  document.body.appendChild(screen);
}

function showWelcome() {
  createWelcomeScreen();

  const screen =
    $("#welcomeScreen");

  if (!screen) {
    return;
  }

  screen.classList.remove(
    "active"
  );

  void screen.offsetWidth;

  screen.classList.add(
    "active"
  );

  clearTimeout(
    SHONEN_STATE.welcomeTimer
  );

  SHONEN_STATE.welcomeTimer =
    setTimeout(() => {
      screen.classList.remove(
        "active"
      );
    }, 2400);
}

window.showWelcome =
  showWelcome;


/* =========================
   HOME
   ========================= */

function renderHome() {
  return `
    ${systemHeader(
      "SHONEN NEXUS // 01",
      "NEXUS OVERVIEW",
      "Anime, chess and community connected through one central club interface."
    )}

    <section class="system-panel">

      <div class="panel-label">
        <span>
          NEXUS IDENTIFICATION
        </span>

        <span>
          SHONEN-NEXUS
        </span>
      </div>

      <div class="home-identity">

        <div class="home-logo-wrap">
          <img
            src="${SHONEN_NEXUS.logoUrl}"
            alt="Shonen Nexus club logo"
            class="home-logo"
          >
        </div>

        <div>

          <div class="system-kicker">
            SHONEN NEXUS
          </div>

          <h2>
            ANIME × CHESS × COMMUNITY
          </h2>

          <p>
            Whether you're a longtime fan of
            the Big Three, grew up watching
            classic shonen, or you're here for
            the newest generation, you're
            welcome here.
          </p>

          <p>
            A place where anime fans and chess
            players from every generation can
            come together.
          </p>

        </div>

      </div>

    </section>

    <section class="system-panel">

      <div class="panel-label">
        <span>
          NEXUS DIRECT LINK
        </span>

        <span>
          ACTIVE
        </span>
      </div>

      <div class="registry-grid">

        <a
          class="member-card"
          href="${SHONEN_NEXUS.clubUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="member-avatar module-number">
            ♟
          </div>

          <div>
            <div class="member-name">
              CHESS.COM CLUB
            </div>

            <div class="member-meta">
              SHONEN NEXUS MAIN HUB
            </div>
          </div>

          <div class="member-time">
            ↗
          </div>

        </a>

        <button
          class="member-card"
          type="button"
          data-action="welcome"
        >

          <div class="member-avatar module-number">
            N
          </div>

          <div>
            <div class="member-name">
              NEXUS BOOT
            </div>

            <div class="member-meta">
              RUN WELCOME SEQUENCE
            </div>
          </div>

          <div class="member-time">
            RUN
          </div>

        </button>

      </div>

    </section>

    <section class="system-panel">

      <div class="panel-label">
        <span>
          MODULE DIRECTORY
        </span>

        <span>
          05 SYSTEMS
        </span>
      </div>

      <div class="registry-grid">

        ${[
          [
            "01",
            "HOME",
            "NEXUS OVERVIEW",
            "#home"
          ],
          [
            "02",
            "REGISTRY",
            "MEMBERS & DICE",
            "#registry"
          ],
          [
            "03",
            "COMMAND",
            "CLUB DIRECTIVES",
            "#command"
          ],
          [
            "04",
            "SOCIAL",
            "RADIO & NETWORK",
            "#social"
          ],
          [
            "05",
            "CALENDAR",
            "TIME & EVENTS",
            "#calendar"
          ]
        ]
          .map(
            ([
              number,
              title,
              meta,
              href
            ]) => `
              <a
                href="${href}"
                class="member-card"
              >

                <div
                  class="member-avatar module-number"
                >
                  ${number}
                </div>

                <div>

                  <div class="member-name">
                    ${title}
                  </div>

                  <div class="member-meta">
                    ${meta}
                  </div>

                </div>

                <div class="member-time">
                  →
                </div>

              </a>
            `
          )
          .join("")}

      </div>

    </section>

    <section class="system-panel">

      <div class="panel-label">
        <span>
          NEXUS BOOT LOG
        </span>

        <span>
          LIVE
        </span>
      </div>

      <div
        class="system-terminal"
        id="homeBootLog"
      >

        <div class="terminal-line">

          <span class="terminal-prompt">
            &gt;
          </span>

          <span class="terminal-muted">
            Initializing Shonen Nexus operating system...
          </span>

        </div>

      </div>

    </section>
  `;
}


/* =========================
   REGISTRY
   ========================= */

function renderRegistry() {
  return `
    ${systemHeader(
      "SHONEN NEXUS // 02",
      "MEMBER REGISTRY",
      "Live member registration data retrieved from the official Chess.com club."
    )}

    <section
      class="system-panel"
      data-registry-page
    >

      <div class="panel-label">

        <span>
          NEWEST MEMBERS
        </span>

        <span>
          CHESS.COM PUBAPI
        </span>

      </div>

      <div
        class="registry-grid"
        data-registry="newest"
        aria-live="polite"
      >

        <div class="system-terminal">

          <div class="terminal-line">

            <span class="terminal-prompt">
              &gt;
            </span>

            <span class="terminal-muted">
              Synchronizing Nexus registry...
            </span>

          </div>

        </div>

      </div>

      <div class="registry-actions">

        <span
          data-registry="updated"
          data-registry-status
        >
          AWAITING REGISTRY SYNCHRONIZATION
        </span>

        <button
          class="system-button"
          type="button"
          data-action="registry-refresh"
        >
          REFRESH REGISTRY
        </button>

      </div>

    </section>

    <section class="system-panel">

      <div class="panel-label">

        <span>
          NEXUS STATUS
        </span>

        <span data-registry="status">
          STANDBY
        </span>

      </div>

      <div class="registry-status-readout">

        <div class="readout-row">
          <span>CLUB</span>

          <strong>
            SHONEN NEXUS
          </strong>
        </div>

        <div class="readout-row">
          <span>DATABASE</span>

          <strong>
            CHESS.COM
          </strong>
        </div>

        <div class="readout-row">
          <span>STATUS</span>

          <strong class="online">
            ONLINE
          </strong>
        </div>

        <div class="readout-row">
          <span>MEMBERS</span>

          <strong data-registry="member-count">
            —
          </strong>
        </div>

      </div>

    </section>

    <section class="system-panel">

      <div class="panel-label">

        <span>
          MEMBER DICE
        </span>

        <span>
          RANDOMIZED
        </span>

      </div>

      <div class="personnel-selection">

        <div>

          <div class="personnel-id">
            NEXUS SUBJECT SELECTION
          </div>

          <div
            class="personnel-name"
            data-registry="random-result"
          >
            AWAITING ROLL
          </div>

          <div class="personnel-status">
            ROLL THE DICE TO SELECT A MEMBER
          </div>

        </div>

      </div>

      <div
        class="registry-actions registry-actions-left"
      >

        <button
          class="system-button"
          type="button"
          data-action="member-dice"
        >
          ROLL MEMBER DICE
        </button>

        <a
          class="system-button"
          href="${SHONEN_NEXUS.clubUrl}/members"
          target="_blank"
          rel="noopener noreferrer"
        >
          FULL MEMBER LIST ↗
        </a>

      </div>

    </section>
  `;
}


/* =========================
   COMMAND
   ========================= */

function renderCommand() {
  const directives = [
    "Respect every member.",
    "Fair Play is mandatory.",
    "Anime discussion should remain welcoming.",
    "Compete with honor.",
    "Keep discussions calm and constructive.",
    "Friendly banter is welcome; hostility is not.",
    "Respect different generations of shonen fandom.",
    "Keep official club content appropriate.",
    "Rules may evolve as the Nexus grows."
  ];

  return `
    ${systemHeader(
      "SHONEN NEXUS // 03",
      "COMMAND CENTER",
      "Club directives, operational links and community protocols."
    )}

    <section class="system-panel">

      <div class="panel-label">

        <span>
          COMMAND MODULES
        </span>

        <span>
          ONLINE
        </span>

      </div>

      <div class="registry-grid">

        <a
          class="member-card"
          href="${SHONEN_NEXUS.clubUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="member-avatar module-number">
            ♟
          </div>

          <div>

            <div class="member-name">
              CLUB HUB
            </div>

            <div class="member-meta">
              SHONEN NEXUS CHESS.COM CLUB
            </div>

          </div>

          <div class="member-time">
            ↗
          </div>

        </a>

        <a
          class="member-card"
          href="${SHONEN_NEXUS.clubUrl}/announcements"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="member-avatar module-number">
            !
          </div>

          <div>

            <div class="member-name">
              ANNOUNCEMENTS
            </div>

            <div class="member-meta">
              OFFICIAL CLUB UPDATES
            </div>

          </div>

          <div class="member-time">
            ↗
          </div>

        </a>

        <a
          class="member-card"
          href="https://www.chess.com/clubs/forum/shonen-nexus"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="member-avatar module-number">
            #
          </div>

          <div>

            <div class="member-name">
              CLUB FORUM
            </div>

            <div class="member-meta">
              COMMUNITY DISCUSSION
            </div>

          </div>

          <div class="member-time">
            ↗
          </div>

        </a>

      </div>

    </section>

    <section class="system-panel">

      <div class="panel-label">

        <span>
          CORE DIRECTIVES
        </span>

        <span>
          AUTHORIZED
        </span>

      </div>

      <div class="registry-grid">

        ${directives
          .map(
            (directive, index) => `
              <div
                class="member-card directive-card"
              >

                <div class="directive-number">
                  ${String(index + 1).padStart(
                    2,
                    "0"
                  )}
                </div>

                <div>

                  <div class="member-name">
                    ${escapeHtml(
                      directive
                    )}
                  </div>

                  <div class="member-meta">
                    NEXUS COMMUNITY DIRECTIVE
                  </div>

                </div>

              </div>
            `
          )
          .join("")}

      </div>

    </section>
  `;
}


/* =========================
   SOCIAL
   ========================= */

function renderSocial() {
  return `
    <section class="page social-page">

      <div class="page-header">

        <div>

          <div class="eyebrow">
            NEXUS NODE // SOCIAL
          </div>

          <h1>
            SOCIAL
          </h1>

          <p class="page-description">
            Shonen Nexus media, radio and network systems.
          </p>

        </div>

        <div class="system-status">

          <span class="status-dot"></span>

          <span>
            NETWORK ONLINE
          </span>

        </div>

      </div>

      <div class="social-grid">

        <article
          class="panel social-channel-panel"
        >

          <div class="panel-header">

            <span>
              CHANNEL
            </span>

            <span class="panel-code">
              COM-01
            </span>

          </div>

          <div class="channel-list">

            <a
              class="social-channel"
              href="${SHONEN_NEXUS.clubUrl}"
              target="_blank"
              rel="noopener noreferrer"
            >

              <div class="channel-icon">
                ♟
              </div>

              <div class="channel-info">

                <strong>
                  CHESS.COM
                </strong>

                <small>
                  SHONEN NEXUS
                </small>

              </div>

              <span class="channel-arrow">
                ↗
              </span>

            </a>

          </div>

        </article>

        <article class="panel network-panel">

          <div class="panel-header">

            <span>
              NEXUS STATUS
            </span>

            <span class="panel-code">
              SYS-04
            </span>

          </div>

          <div class="system-readout">

            <div class="readout-row">
              <span>
                CONNECTION
              </span>

              <strong class="online">
                ESTABLISHED
              </strong>
            </div>

            <div class="readout-row">
              <span>
                CLUB NODE
              </span>

              <strong>
                SHONEN-NEXUS
              </strong>
            </div>

            <div class="readout-row">
              <span>
                ACCESS
              </span>

              <strong>
                PUBLIC
              </strong>
            </div>

            <div class="readout-row">
              <span>
                PROTOCOL
              </span>

              <strong>
                ACTIVE
              </strong>
            </div>

          </div>

          <div class="terminal-note">

            <span>
              &gt;
            </span>

            <span>
              NEXUS COMMUNICATION NODE OPERATIONAL.
            </span>

          </div>

        </article>

      </div>

      <article class="panel radio-panel">

        <div class="panel-header">

          <span>
            NEXUS RADIO
          </span>

          <span class="panel-code">
            MEDIA-07
          </span>

        </div>

        <div class="radio-layout">

          <div class="radio-cover-wrap">

            <img
              id="radioCover"
              class="radio-cover"
              src="${SHONEN_NEXUS.logoUrl}"
              alt="Shonen Nexus Radio cover"
            >

          </div>

          <div class="radio-player">

            <div class="radio-system-label">

              <span class="status-dot"></span>

              AUDIO TRANSMISSION

            </div>

            <h2 id="radioTitle">
              INITIALIZING...
            </h2>

            <p id="radioArtist">
              Establishing Nexus Radio connection...
            </p>

            <div class="radio-progress">

              <span id="elapsed">
                0:00
              </span>

              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                value="0"
                step="0.1"
                aria-label="Track progress"
              >

              <span id="duration">
                0:00
              </span>

            </div>

            <div class="radio-controls">

              <button
                id="radioPrev"
                type="button"
              >
                ◀◀
              </button>

              <button
                id="radioPlay"
                class="radio-play"
                type="button"
              >
                ▶ PLAY
              </button>

              <button
                id="radioNext"
                type="button"
              >
                ▶▶
              </button>

            </div>

            <div class="radio-volume">

              <span>
                VOL
              </span>

              <input
                id="radioVolume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value="0.75"
                aria-label="Volume"
              >

            </div>

          </div>

        </div>

        <div class="radio-playlist">

          <div class="playlist-header">

            <span>
              TRANSMISSION QUEUE
            </span>

            <span>

              <span class="status-dot"></span>

              LIVE

            </span>

          </div>

          <div
            id="trackList"
            class="track-list"
          >

            <div class="system-terminal">

              <div class="terminal-line">

                <span class="terminal-prompt">
                  &gt;
                </span>

                <span class="terminal-muted">
                  SCANNING NEXUS AUDIO DATABASE...
                </span>

              </div>

            </div>

          </div>

        </div>

      </article>

            <article class="panel youtube-panel">

        <div class="panel-header">

          <span>
            YOUTUBE
          </span>

          <span class="panel-code">
            MEDIA-08
          </span>

        </div>

        <div class="youtube-interface">

          <div class="youtube-terminal">

            <div class="radio-system-label">

              <span class="status-dot"></span>

              YOUTUBE TRANSMISSION NODE

            </div>

            <h2>
              SEARCH THE NETWORK
            </h2>

            <p>
              Search for anime openings, OSTs,
              AMVs, edits, fights, playlists,
              or whatever is currently occupying
              your brain at 2 A.M.
            </p>

          </div>


          <form
            class="youtube-search"
            data-youtube-search
          >

            <div class="youtube-search-row">

              <input
                type="search"
                id="youtubeSearch"
                name="q"
                placeholder="SEARCH YOUTUBE..."
                autocomplete="off"
                spellcheck="false"
                aria-label="Search YouTube"
              >

              <button
                class="system-button"
                type="submit"
              >
                SEARCH ↗
              </button>

            </div>

            <div class="youtube-search-presets">

              <button
                type="button"
                class="youtube-preset"
                data-youtube-query="anime openings"
              >
                ANIME OPENINGS
              </button>

              <button
                type="button"
                class="youtube-preset"
                data-youtube-query="Jujutsu Kaisen opening"
              >
                JJK
              </button>

              <button
                type="button"
                class="youtube-preset"
                data-youtube-query="WIND BREAKER opening"
              >
                WIND BREAKER
              </button>

              <button
                type="button"
                class="youtube-preset"
                data-youtube-query="Bleach openings"
              >
                BLEACH
              </button>

              <button
                type="button"
                class="youtube-preset"
                data-youtube-query="Naruto openings"
              >
                NARUTO
              </button>

            </div>

          </form>

        </div>


        <div class="youtube-embed-wrap">

          <div class="youtube-embed-header">

            <span>
              OPTIONAL VIDEO TRANSMISSION
            </span>

            <span>
              YOUTUBE
            </span>

          </div>

          <div class="youtube-placeholder">

            <div class="youtube-placeholder-icon">
              ▶
            </div>

            <strong>
              NO VIDEO LOADED
            </strong>

            <small>
              SEARCH YOUTUBE ABOVE TO OPEN A TRANSMISSION
            </small>

          </div>

          <iframe
            id="youtubePlayer"
            class="youtube-player"
            title="YouTube player"
            src="about:blank"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>

        </div>

      </article>

      <div class="social-footer-readout">

        <span>
          SHONEN NEXUS
        </span>

        <span>
          //
        </span>

        <span>
          SOCIAL COMMUNICATION NODE
        </span>

        <span>
          //
        </span>

        <span>
          STATUS: ONLINE
        </span>

      </div>

      <audio
        id="audio"
        preload="metadata"
      ></audio>

    </section>
  `;
}


/* =========================
   CALENDAR
   ========================= */

function renderCalendarPage() {
  return `
    ${systemHeader(
      "SHONEN NEXUS // 05",
      "TIME MANAGEMENT SYSTEM",
      "Nexus calendar, local time synchronization and UTC+9 conversion."
    )}

    <section
      class="system-panel shonen-calendar-panel"
      data-calendar-page
    >

      <div class="panel-label">

        <span>
          NEXUS CALENDAR
        </span>

        <span data-calendar="timezone">
          LOCAL
        </span>

      </div>

      <div class="shonen-calendar-header">

        <button
          class="system-button"
          type="button"
          data-calendar="previous"
          aria-label="Previous month"
        >
          ◀
        </button>

        <h2 data-calendar="month">
          Loading...
        </h2>

        <button
          class="system-button"
          type="button"
          data-calendar="next"
          aria-label="Next month"
        >
          ▶
        </button>

      </div>

      <div class="shonen-time-panel">

        <div class="shonen-timezone">

          <span data-calendar="timezone">
            LOCAL
          </span>

        </div>

        <div class="shonen-location">
          NEXUS TIME NODE
        </div>

      </div>

      <div class="shonen-calendar-weekdays">

        ${[
          "SUN",
          "MON",
          "TUE",
          "WED",
          "THU",
          "FRI",
          "SAT"
        ]
          .map(
            day =>
              `<span>${day}</span>`
          )
          .join("")}

      </div>

      <div
        class="shonen-calendar-grid"
        data-calendar="grid"
      ></div>

      <div class="shonen-calendar-footer">

        <button
          class="system-button"
          type="button"
          data-action="timezone-toggle"
        >
          LOCAL / UTC+9
        </button>

      </div>

    </section>
  `;
}


/* =========================
   PAGE MAP
   ========================= */

const pages = {
  home: renderHome,
  registry: renderRegistry,
  command: renderCommand,
  social: renderSocial,
  calendar: renderCalendarPage
};


/* =========================
   HOME BOOT
   ========================= */

function startHomeBoot() {
  clearInterval(
    SHONEN_STATE.bootTimer
  );

  const box =
    $("#homeBootLog");

  if (!box) {
    return;
  }

  const messages = [
    "SHONEN NEXUS OS kernel initialized.",
    "Nexus identification verified.",
    "Chess.com club connection established.",
    "Member registry subsystem standing by.",
    "Anime network protocols detected.",
    "Command module loaded.",
    "Calendar synchronization loaded.",
    "Nexus Radio subsystem standing by.",
    "All primary systems operational."
  ];

  let index = 0;

  box.innerHTML = "";

  const addLine = () => {
    if (
      !document.body.contains(box)
    ) {
      clearInterval(
        SHONEN_STATE.bootTimer
      );

      return;
    }

    if (
      index >= messages.length
    ) {
      clearInterval(
        SHONEN_STATE.bootTimer
      );

      return;
    }

    const line =
      document.createElement("div");

    line.className =
      "terminal-line";

    line.innerHTML = `
      <span class="terminal-prompt">
        &gt;
      </span>

      <span class="terminal-ok">
        ${escapeHtml(
          messages[index++]
        )}
      </span>
    `;

    box.appendChild(line);
  };

  addLine();

  SHONEN_STATE.bootTimer =
    setInterval(
      addLine,
      360
    );
}


/* =========================
   PAGE EVENT BRIDGES
   ========================= */

function bindHomeEvents() {
  $$(
    '[data-action="welcome"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      showWelcome
    );
  });
}

function bindRegistryEvents() {
  $$(
    '[data-action="registry-refresh"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      () => {
        window.ShonenRegistry
          ?.load?.();
      }
    );
  });

  $$(
    '[data-action="member-dice"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      () => {
        window.ShonenRegistry
          ?.random?.();
      }
    );
  });
}

function bindCalendarEvents() {
  $$(
    '[data-calendar="previous"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      () => {
        window.ShonenCalendar
          ?.previousMonth?.();
      }
    );
  });

  $$(
    '[data-calendar="next"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      () => {
        window.ShonenCalendar
          ?.nextMonth?.();
      }
    );
  });

  $$(
    '[data-calendar="today"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      () => {
        window.ShonenCalendar
          ?.refresh?.();
      }
    );
  });

  $$(
    '[data-action="timezone-toggle"]'
  ).forEach(button => {
    button.addEventListener(
      "click",
      () => {
        window.ShonenCalendar
          ?.toggleTimezone?.();
      }
    );
  });
}

function bindYouTubeEvents() {
  const searchForm =
    $("[data-youtube-search]");

  const searchInput =
    $("#youtubeSearch");

  const player =
    $("#youtubePlayer");

  const placeholder =
    $(".youtube-placeholder");

  if (searchForm && searchInput) {
    searchForm.addEventListener(
      "submit",
      event => {
        event.preventDefault();

        const query =
          searchInput.value.trim();

        if (!query) {
          searchInput.focus();
          return;
        }

        const youtubeSearchURL =
          `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

        window.open(
          youtubeSearchURL,
          "_blank",
          "noopener,noreferrer"
        );
      }
    );
  }

  $$(".youtube-preset").forEach(button => {
    button.addEventListener(
      "click",
      () => {
        const query =
          button.dataset.youtubeQuery || "";

        if (!searchInput) {
          return;
        }

        searchInput.value = query;

        searchInput.focus();
      }
    );
  });
}

/* =========================
   RENDER
   ========================= */

function render() {
  if (!app) {
    console.error(
      "SHONEN NEXUS: #app not found."
    );

    return;
  }

  const route =
    getRoute();

  SHONEN_STATE.currentSection =
    route;

  if (
    route !== "social" &&
    typeof window
      .stopRadioForNavigation ===
      "function"
  ) {
    window.stopRadioForNavigation();
  }

  const renderer =
    pages[route] ||
    pages.home;

  app.innerHTML =
    renderer();

  updateNavigation(route);

  closeSidebar();

  switch (route) {
    case "home":
      bindHomeEvents();
      startHomeBoot();
      break;

    case "registry":
      bindRegistryEvents();

      window.ShonenRegistry
        ?.load?.();

      break;

    case "social":
      window.renderRadioPage?.();
      bindYouTubeEvents();
      break;

    case "calendar":
      bindCalendarEvents();

      window.ShonenCalendar
        ?.refresh?.();

      break;
  }

  app.focus?.({
    preventScroll: true
  });
}


/* =========================
   STARTUP
   ========================= */

function init() {
  initNavigation();

  window.addEventListener(
    "hashchange",
    render
  );

  render();
}


/* =========================
   BOOT
   ========================= */

function bootShonenNexus() {
  console.log(
    "%c SHONEN NEXUS ",
    "color:#b11226;font-weight:900;font-size:14px;"
  );

  console.log(
    "%c NEXUS OS // SYSTEM ONLINE ",
    "color:#4bdd91;font-weight:800;"
  );

  console.log(
    "Club:",
    SHONEN_NEXUS.clubUrl
  );

  console.log(
    "Modules:",
    SHONEN_NEXUS.sections.join(
      " / "
    )
  );

  init();
}


if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    bootShonenNexus,
    {
      once: true
    }
  );
} else {
  bootShonenNexus();
}