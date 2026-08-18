(() => {
  "use strict";

  /* =========================================================
     AURA
     ========================================================= */

  const AURA_KEY = "shonenNexusAura";

  function setAura(aura) {
    document.body.dataset.aura = aura;

    localStorage.setItem(
      AURA_KEY,
      aura
    );

    document
      .querySelectorAll("[data-aura]")
      .forEach(button => {
        button.classList.toggle(
          "selected",
          button.dataset.aura === aura
        );
      });
  }

  function restoreAura() {
    const saved =
      localStorage.getItem(AURA_KEY) ||
      "wind";

    document.body.dataset.aura = saved;
  }


  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {
    restoreAura();

    document
      .querySelectorAll("[data-aura]")
      .forEach(button => {
        button.addEventListener(
          "click",
          () => {
            setAura(
              button.dataset.aura
            );
          }
        );
      });
  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.ShonenAura = {
    init,
    set: setAura
  };

})();