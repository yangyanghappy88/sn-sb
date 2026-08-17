const GAME_API = {
  chessClub: "shonen-nexus",
  chessBase: "https://api.chess.com/pub",
  aniList: "https://graphql.anilist.co"
};

(() => {
  "use strict";


  /* game data */

  const QUESTIONS = [
    {
      anime: "One Piece",
      clues: [
        "A pirate crew searches for a legendary treasure.",
        "Its protagonist is known for his straw hat.",
        "The story takes place across a massive world of islands."
      ],
      options: [
        "One Piece",
        "Bleach",
        "Hunter x Hunter",
        "Black Clover"
      ]
    },

    {
      anime: "Bleach",
      clues: [
        "A teenager becomes involved with supernatural beings.",
        "Soul Reapers play a major role in the story.",
        "Its protagonist uses a sword called a Zanpakuto."
      ],
      options: [
        "Jujutsu Kaisen",
        "Bleach",
        "Demon Slayer",
        "Naruto"
      ]
    },

    {
      anime: "Naruto",
      clues: [
        "Its protagonist dreams of becoming the leader of his village.",
        "Ninja clans and chakra are central to the story.",
        "The protagonist is associated with a powerful fox."
      ],
      options: [
        "Naruto",
        "One Piece",
        "My Hero Academia",
        "Blue Lock"
      ]
    },

    {
      anime: "Jujutsu Kaisen",
      clues: [
        "Curses threaten humanity.",
        "Its protagonist becomes involved with a powerful cursed object.",
        "A school trains sorcerers to fight supernatural threats."
      ],
      options: [
        "Jujutsu Kaisen",
        "Chainsaw Man",
        "Bleach",
        "Mob Psycho 100"
      ]
    },

    {
      anime: "Demon Slayer",
      clues: [
        "A young swordsman searches for a way to restore his sister.",
        "Demons are the primary supernatural threat.",
        "The series features specialized breathing techniques."
      ],
      options: [
        "Demon Slayer",
        "Attack on Titan",
        "Naruto",
        "Fire Force"
      ]
    },

    {
      anime: "Hunter x Hunter",
      clues: [
        "A young boy searches for his missing father.",
        "Hunters undertake dangerous missions around the world.",
        "Nen is the series' central supernatural power system."
      ],
      options: [
        "Hunter x Hunter",
        "One Piece",
        "Yu Yu Hakusho",
        "Black Clover"
      ]
    },

    {
      anime: "My Hero Academia",
      clues: [
        "Superpowers are known as Quirks.",
        "A student enters a school designed to train heroes.",
        "The protagonist begins without a natural superpower."
      ],
      options: [
        "My Hero Academia",
        "Blue Lock",
        "Fire Force",
        "Naruto"
      ]
    },

    {
      anime: "Blue Lock",
      clues: [
        "Japan seeks to create an elite striker.",
        "Hundreds of players compete in an intense training program.",
        "The story revolves around football."
      ],
      options: [
        "Blue Lock",
        "Haikyuu!!",
        "Kuroko's Basketball",
        "Ao Ashi"
      ]
    },

    {
      anime: "Attack on Titan",
      clues: [
        "Humanity survives behind enormous walls.",
        "Giant humanoid creatures threaten civilization.",
        "The protagonists belong to military organizations."
      ],
      options: [
        "Attack on Titan",
        "Demon Slayer",
        "86",
        "Vinland Saga"
      ]
    },

    {
      anime: "Black Clover",
      clues: [
        "Magic is central to the world.",
        "The protagonist is born without magical ability.",
        "He dreams of becoming the Wizard King."
      ],
      options: [
        "Black Clover",
        "Fairy Tail",
        "Naruto",
        "Magi"
      ]
    }
  ];


  /* =========================================================
     STATE
     ========================================================= */

  const STATE = {
    score: 0,
    streak: 0,
    best: Number(localStorage.getItem("shonenNexusGameBest") || 0),
    round: 0,
    answered: false,
    question: null,
    usedQuestions: []
  };


  /* =========================================================
     DOM
     ========================================================= */

  let root = null;


  /* =========================================================
     HELPERS
     ========================================================= */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }


  function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }


  /* =========================================================
     QUESTION SELECTION
     ========================================================= */

  function getQuestion() {
    let available = QUESTIONS.filter(
      (_, index) => !STATE.usedQuestions.includes(index)
    );

    if (!available.length) {
      STATE.usedQuestions = [];
      available = QUESTIONS;
    }

    const question = randomItem(available);

    const index = QUESTIONS.indexOf(question);

    STATE.usedQuestions.push(index);

    return {
      ...question,
      options: shuffle(question.options)
    };
  }


  /* =========================================================
     RENDER
     ========================================================= */

  function render() {
    if (!root) {
      return;
    }

    STATE.question = getQuestion();
    STATE.answered = false;
    STATE.round += 1;

    root.innerHTML = `
      <div class="nexus-game">

        <div class="nexus-game-header">

          <div>

            <div class="game-kicker">
              SHONEN NEXUS // GAME-01
            </div>

            <h2>
              ANIME PROTOCOL
            </h2>

            <p>
              Identify the anime from the available intelligence.
            </p>

          </div>


          <div class="game-score-panel">

            <div>
              <span>SCORE</span>
              <strong data-game-score>
                ${STATE.score}
              </strong>
            </div>

            <div>
              <span>STREAK</span>
              <strong data-game-streak>
                ${STATE.streak}
              </strong>
            </div>

            <div>
              <span>BEST</span>
              <strong data-game-best>
                ${STATE.best}
              </strong>
            </div>

          </div>

        </div>


        <div class="game-round-bar">

          <span>
            ROUND ${String(STATE.round).padStart(2, "0")}
          </span>

          <span>
            NEXUS INTELLIGENCE TEST
          </span>

        </div>


        <div class="game-question">

          <div class="game-question-label">
            IDENTIFICATION DATA
          </div>


          <div class="game-clues">

            ${STATE.question.clues
              .map(
                (clue, index) => `
                  <div class="game-clue">

                    <span class="game-clue-number">
                      0${index + 1}
                    </span>

                    <span>
                      ${escapeHtml(clue)}
                    </span>

                  </div>
                `
              )
              .join("")}

          </div>

        </div>


        <div class="game-options">

          <div class="game-question-label">
            SELECT IDENTIFICATION
          </div>


          <div class="game-option-grid">

            ${STATE.question.options
              .map(
                (option, index) => `
                  <button
                    type="button"
                    class="game-option"
                    data-game-option="${escapeHtml(option)}"
                  >

                    <span class="game-option-index">
                      0${index + 1}
                    </span>

                    <span>
                      ${escapeHtml(option)}
                    </span>

                    <span class="game-option-arrow">
                      →
                    </span>

                  </button>
                `
              )
              .join("")}

          </div>

        </div>


        <div
          class="game-result"
          data-game-result
          aria-live="polite"
        >
          AWAITING PLAYER INPUT
        </div>


        <div class="game-footer">

          <button
            type="button"
            class="game-next"
            data-game-next
          >
            NEXT PROTOCOL →
          </button>

          <span>
            BEST SCORE: ${STATE.best}
          </span>

        </div>

      </div>
    `;

    bindRound();
  }


  /* =========================================================
     ROUND EVENTS
     ========================================================= */

  function bindRound() {
    const options = root.querySelectorAll("[data-game-option]");
    const nextButton = root.querySelector("[data-game-next]");

    options.forEach(option => {
      option.addEventListener("click", () => {
        answer(option.dataset.gameOption);
      });
    });

    if (nextButton) {
      nextButton.addEventListener("click", render);
    }
  }


  /* =========================================================
     ANSWER
     ========================================================= */

  function answer(selected) {
    if (STATE.answered) {
      return;
    }

    STATE.answered = true;

    const correct = STATE.question.anime;

    const options = root.querySelectorAll("[data-game-option]");

    options.forEach(option => {
      const value = option.dataset.gameOption;

      option.disabled = true;

      if (value === correct) {
        option.classList.add("correct");
      }

      if (value === selected && value !== correct) {
        option.classList.add("incorrect");
      }
    });


    const result = root.querySelector("[data-game-result]");

    if (selected === correct) {

      STATE.score += 100;

      STATE.streak += 1;

      if (STATE.score > STATE.best) {
        STATE.best = STATE.score;

        localStorage.setItem(
          "shonenNexusGameBest",
          String(STATE.best)
        );
      }

      if (result) {
        result.innerHTML = `
          <strong>
            IDENTIFICATION CONFIRMED
          </strong>

          <span>
            +100 NEXUS POINTS // ${escapeHtml(correct)}
          </span>
        `;

        result.classList.add("success");
      }

    } else {

      STATE.streak = 0;

      if (result) {
        result.innerHTML = `
          <strong>
            IDENTIFICATION FAILED
          </strong>

          <span>
            CORRECT TARGET // ${escapeHtml(correct)}
          </span>
        `;

        result.classList.add("failure");
      }
    }


    updateScore();
  }


  /* =========================================================
     SCORE UPDATE
     ========================================================= */

  function updateScore() {
    const score = root.querySelector("[data-game-score]");
    const streak = root.querySelector("[data-game-streak]");
    const best = root.querySelector("[data-game-best]");

    if (score) {
      score.textContent = STATE.score;
    }

    if (streak) {
      streak.textContent = STATE.streak;
    }

    if (best) {
      best.textContent = STATE.best;
    }
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

function init() {
  root = document.querySelector("[data-game-app]");

  if (!root) {
    return;
  }

  render();

  loadGameData();
}


  /* meh */

  window.ShonenGame = {
    init,
    reset() {
      STATE.score = 0;
      STATE.streak = 0;
      STATE.round = 0;
      STATE.usedQuestions = [];

      render();
    }
  };

})();

async function fetchTrendingAnime() {
  const query = `
    query {
      Page(page: 1, perPage: 3) {
        media(
          type: ANIME
          sort: TRENDING_DESC
          isAdult: false
        ) {
          id

          title {
            romaji
            english
            native
          }

          coverImage {
            large
          }

          bannerImage

          averageScore
          popularity
          trending

          format
          episodes

          siteUrl
        }
      }
    }
  `;

  const response = await fetch(GAME_API.aniList, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },

    body: JSON.stringify({
      query
    })
  });

  if (!response.ok) {
    throw new Error(
      `AniList request failed: ${response.status}`
    );
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(
      data.errors[0]?.message || "AniList API error"
    );
  }

  return data.data.Page.media;
}

function renderTrendingAnime(anime) {
  const container = document.querySelector("[data-game-anime]");

  if (!container) {
    return;
  }

  if (!anime || !anime.length) {
    container.innerHTML = `
      <div class="member-card">
        <div class="member-name">
          NO TRENDING DATA
        </div>

        <div class="member-meta">
          ANILIST FEED UNAVAILABLE
        </div>
      </div>
    `;

    return;
  }

  container.innerHTML = anime
    .map((item, index) => {

      const title =
        item.title.english ||
        item.title.romaji ||
        item.title.native ||
        "UNKNOWN ANIME";

      const format =
        item.format ||
        "UNKNOWN";

      return `
        <a
          class="member-card game-anime-card"
          href="${escapeHtml(item.siteUrl)}"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="member-avatar module-number">
            ${String(index + 1).padStart(2, "0")}
          </div>


          <div class="game-anime-info">

            <div class="member-name">
              ${escapeHtml(title)}
            </div>

            <div class="member-meta">
              ${escapeHtml(format)}
              ${item.episodes ? ` · ${item.episodes} EP` : ""}
            </div>

          </div>


          <div class="game-anime-stats">

            <span>
              TREND ${Number(item.trending || 0).toLocaleString()}
            </span>

            <span>
              POP ${Number(item.popularity || 0).toLocaleString()}
            </span>

          </div>

        </a>
      `;
    })
    .join("");
}

async function fetchChessMatches() {
  const url =
    `${GAME_API.chessBase}/club/${encodeURIComponent(
      GAME_API.chessClub
    )}/matches`;

  const response = await fetch(url, {
    headers: {
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(
      `Chess.com request failed: ${response.status}`
    );
  }

  return response.json();
}

function getRecentChessMatches(data) {
  const inProgress = Array.isArray(data.in_progress)
    ? data.in_progress
    : [];

  const registered = Array.isArray(data.registered)
    ? data.registered
    : [];

  const finished = Array.isArray(data.finished)
    ? data.finished
    : [];

  return [
    ...inProgress,
    ...registered,
    ...finished
  ].slice(0, 3);
}

function renderChessMatches(matches) {
  const container = document.querySelector(
    "[data-game-matches]"
  );

  if (!container) {
    return;
  }

  if (!matches.length) {
    container.innerHTML = `
      <div class="member-card">

        <div class="member-avatar module-number">
          ♟
        </div>

        <div>

          <div class="member-name">
            NO ACTIVE MATCHES
          </div>

          <div class="member-meta">
            CHESS.COM MATCH FEED
          </div>

        </div>

        <div class="member-time">
          —
        </div>

      </div>
    `;

    return;
  }

  container.innerHTML = matches
    .map((match, index) => {

      const status =
        match.result
          ? String(match.result).toUpperCase()
          : "ACTIVE";

      const opponent =
        match.opponent
          ? match.opponent
              .split("/")
              .filter(Boolean)
              .pop()
          : "UNKNOWN OPPONENT";

      const matchUrl =
        match["@id"] ||
        match.id ||
        "#";

      return `
        <a
          class="member-card game-match-card"
          href="${escapeHtml(matchUrl)}"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div class="member-avatar module-number">
            ${String(index + 1).padStart(2, "0")}
          </div>


          <div>

            <div class="member-name">
              ${escapeHtml(
                match.name || "NEXUS MATCH"
              )}
            </div>

            <div class="member-meta">
              VS ${escapeHtml(opponent)}
            </div>

          </div>


          <div class="member-time">
            ${escapeHtml(status)}
          </div>

        </a>
      `;
    })
    .join("");
}

async function loadGameData() {
  const animeContainer = document.querySelector(
    "[data-game-anime]"
  );

  const matchContainer = document.querySelector(
    "[data-game-matches]"
  );


  if (animeContainer) {
    animeContainer.innerHTML = `
      <div class="member-card">
        <div class="member-name">
          SYNCHRONIZING...
        </div>

        <div class="member-meta">
          ANILIST NETWORK
        </div>
      </div>
    `;
  }


  if (matchContainer) {
    matchContainer.innerHTML = `
      <div class="member-card">
        <div class="member-name">
          SYNCHRONIZING...
        </div>

        <div class="member-meta">
          CHESS.COM NETWORK
        </div>
      </div>
    `;
  }


  const [animeResult, chessResult] =
    await Promise.allSettled([
      fetchTrendingAnime(),
      fetchChessMatches()
    ]);


  if (animeResult.status === "fulfilled") {

    renderTrendingAnime(
      animeResult.value
    );

  } else {

    console.error(
      "AniList error:",
      animeResult.reason
    );

    if (animeContainer) {
      animeContainer.innerHTML = `
        <div class="member-card">

          <div class="member-name">
            ANILIST FEED OFFLINE
          </div>

          <div class="member-meta">
            UNABLE TO SYNCHRONIZE
          </div>

        </div>
      `;
    }
  }


  if (chessResult.status === "fulfilled") {

    renderChessMatches(
      getRecentChessMatches(
        chessResult.value
      )
    );

  } else {

    console.error(
      "Chess.com error:",
      chessResult.reason
    );

    if (matchContainer) {
      matchContainer.innerHTML = `
        <div class="member-card">

          <div class="member-name">
            CHESS FEED OFFLINE
          </div>

          <div class="member-meta">
            UNABLE TO SYNCHRONIZE
          </div>

        </div>
      `;
    }
  }
}