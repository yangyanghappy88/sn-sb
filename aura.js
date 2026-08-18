(() => {
  "use strict";

  const firebaseConfig = {
  apiKey: "AIzaSyBMTdTflLyfIO7QzhsXN_KHCXkHEP6seio",
  authDomain: "shonen-nexus.firebaseapp.com",
  projectId: "shonen-nexus",
  storageBucket: "shonen-nexus.firebasestorage.app",
  messagingSenderId: "319610575707",
  appId: "1:319610575707:web:4141cccbdd47ad3c5b587e",
  measurementId: "G-4NLDR7GKZH"
};

  /* aura */

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
     BIRTHDAY VALIDATION
     ========================================================= */

  function isValidBirthday(month, day, year) {

    month = Number(month);
    day = Number(day);
    year = Number(year);


    if (
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      !Number.isInteger(year)
    ) {
      return false;
    }


    if (month < 1 || month > 12) {
      return false;
    }


    const currentYear =
      new Date().getFullYear();


    if (
      year < 1900 ||
      year > currentYear
    ) {
      return false;
    }


    const date = new Date(
      year,
      month - 1,
      day
    );


    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );

  }


  /* =========================================================
     FIREBASE
     ========================================================= */

  let firebaseReady = null;


  async function loadFirebase() {

    if (firebaseReady) {
      return firebaseReady;
    }


    firebaseReady = (async () => {

      const {
        initializeApp,
        getApps
      } = await import(
        "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js"
      );


      const {
        getAuth
      } = await import(
        "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js"
      );


      const {
        getFirestore,
        doc,
        setDoc,
        serverTimestamp
      } = await import(
        "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js"
      );


      const app =
        getApps().length
          ? getApps()[0]
          : initializeApp(firebaseConfig);


      const auth =
        getAuth(app);


      const db =
        getFirestore(app);


      return {
        auth,
        db,
        doc,
        setDoc,
        serverTimestamp
      };

    })();


    return firebaseReady;

  }


  /* =========================================================
     STATUS
     ========================================================= */

  function setBirthdayStatus(
    message,
    type = ""
  ) {

    const status =
      document.querySelector(
        "[data-birthday-status]"
      );


    if (!status) {
      return;
    }


    status.textContent = message;

    status.classList.remove(
      "success",
      "error"
    );


    if (type) {
      status.classList.add(type);
    }

  }


  /* =========================================================
     REGISTER BIRTHDAY
     ========================================================= */

  async function registerBirthday(event) {

    event.preventDefault();


    const monthInput =
      document.querySelector(
        "[data-birthday-month]"
      );


    const dayInput =
      document.querySelector(
        "[data-birthday-day]"
      );


    const yearInput =
      document.querySelector(
        "[data-birthday-year]"
      );


    if (
      !monthInput ||
      !dayInput ||
      !yearInput
    ) {
      return;
    }


    const month =
      Number(monthInput.value);


    const day =
      Number(dayInput.value);


    const year =
      Number(yearInput.value);


    /* -------------------------------------------------------
       DATE VALIDATION
       ------------------------------------------------------- */

    if (
      !isValidBirthday(
        month,
        day,
        year
      )
    ) {

      setBirthdayStatus(
        "INVALID BIRTHDAY // CHECK DATE",
        "error"
      );

      return;

    }


    /* -------------------------------------------------------
       FIREBASE AUTH
       ------------------------------------------------------- */

    setBirthdayStatus(
      "CONNECTING TO FIREBASE..."
    );


    try {

      const {
        auth,
        db,
        doc,
        setDoc,
        serverTimestamp
      } = await loadFirebase();


      const user =
        auth.currentUser;


      if (!user) {

        setBirthdayStatus(
          "AUTHENTICATION REQUIRED // SIGN IN FIRST",
          "error"
        );

        return;

      }


      /* -----------------------------------------------------
         FIRESTORE DOCUMENT
         ----------------------------------------------------- */

      const birthdayRef =
        doc(
          db,
          "birthdays",
          user.uid
        );


      await setDoc(
        birthdayRef,
        {
          uid: user.uid,

          month,

          day,

          year,

          monthDay:
            `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,

          updatedAt:
            serverTimestamp()
        },
        {
          merge: true
        }
      );


      setBirthdayStatus(
        "REGISTRATION CONFIRMED // NEXUS RECORD UPDATED",
        "success"
      );


    } catch (error) {

      console.error(
        "Birthday registration failed:",
        error
      );


      setBirthdayStatus(
        "REGISTRATION FAILED // FIREBASE ERROR",
        "error"
      );

    }

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


    const birthdayForm =
      document.querySelector(
        "[data-birthday-form]"
      );


    if (birthdayForm) {

      birthdayForm.addEventListener(
        "submit",
        registerBirthday
      );

    }

  }


  /* =========================================================
     PUBLIC API
     ========================================================= */

  window.ShonenAura = {
    init,
    set: setAura,
    validateBirthday: isValidBirthday,
    registerBirthday
  };

})();