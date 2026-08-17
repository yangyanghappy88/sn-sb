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