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
    ]

};


/* dom */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* page */

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .replace(".html", "")
        .toLowerCase() || "index";


/* nav */

function initNavigation() {

    const menuToggle = $("#menuToggle");
    const sideNav = $("#sideNav");
    const navClose = $("#navClose");
    const navOverlay = $("#navOverlay");

    if (!menuToggle || !sideNav) {
        return;
    }


    function openMenu() {

        sideNav.classList.add("open");

        menuToggle.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        if (navOverlay) {
            navOverlay.classList.add("active");
        }

        document.body.classList.add("nav-open");

    }


    function closeMenu() {

        sideNav.classList.remove("open");

        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        if (navOverlay) {
            navOverlay.classList.remove("active");
        }

        document.body.classList.remove("nav-open");

    }


    function toggleMenu() {

        if (sideNav.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }

    }


    /* Hamburger */

    menuToggle.addEventListener(
        "click",
        toggleMenu
    );


    /* X button */

    if (navClose) {

        navClose.addEventListener(
            "click",
            closeMenu
        );

    }


    /* Dark overlay */

    if (navOverlay) {

        navOverlay.addEventListener(
            "click",
            closeMenu
        );

    }


    /* Navigation links */

    $$(".nav-link").forEach(link => {

        link.addEventListener(
            "click",
            () => {

                /*
                 * On mobile the menu should close.
                 * Desktop CSS can simply keep it visible.
                 */

                if (
                    window.matchMedia(
                        "(max-width: 899px)"
                    ).matches
                ) {

                    closeMenu();

                }

            }
        );

    });


    /* Escape */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMenu();

            }

        }
    );


    /*
     * Keep the menu sane when resizing.
     */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >= 900
            ) {

                closeMenu();

            }

        }
    );

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function initActiveNavigation() {

    $$(".nav-link").forEach(link => {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }


        const page =
            href
                .split("/")
                .pop()
                .replace(".html", "")
                .toLowerCase();


        link.classList.toggle(
            "active",
            page === currentPage
        );

    });

}


/* =========================================================
   SCROLL CONTROLS
   ========================================================= */

function scrollToTop() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function scrollToBottom() {

    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
    });

}


window.scrollToTop =
    scrollToTop;

window.scrollToBottom =
    scrollToBottom;


/* =========================================================
   SCROLL STATE
   ========================================================= */

function initScrollState() {

    function updateScrollState() {

        const atTop =
            window.scrollY <= 10;

        const atBottom =
            window.innerHeight +
            window.scrollY >=
            document.documentElement.scrollHeight - 10;


        document.body.classList.toggle(
            "at-top",
            atTop
        );

        document.body.classList.toggle(
            "at-bottom",
            atBottom
        );

    }


    window.addEventListener(
        "scroll",
        updateScrollState,
        { passive: true }
    );


    updateScrollState();

}


/* =========================================================
   SCANLINE
   ========================================================= */

function initScanline() {

    const overlay =
        $("#scanlineOverlay");

    if (!overlay) {
        return;
    }


    const saved =
        localStorage.getItem(
            "shonen-scanline"
        );


    if (saved === "true") {

        overlay.classList.add(
            "active"
        );

    }


    $$('[data-action="scanline"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const enabled =
                        overlay.classList.toggle(
                            "active"
                        );


                    localStorage.setItem(
                        "shonen-scanline",
                        String(enabled)
                    );

                }
            );

        });

}


/* =========================================================
   FOCUS MODE
   ========================================================= */

function initFocusMode() {

    $$('[data-action="focus"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const enabled =
                        document.body.classList.toggle(
                            "focus-mode"
                        );


                    button.classList.toggle(
                        "active",
                        enabled
                    );

                }
            );

        });

}


/* =========================================================
   COPY INVITE LINK
   ========================================================= */

async function copyInviteLink(button = null) {

    try {

        await navigator.clipboard.writeText(
            SHONEN_NEXUS.inviteUrl
        );


        if (!button) {
            return;
        }


        const original =
            button.dataset.originalText ||
            button.textContent;


        button.dataset.originalText =
            original;


        button.textContent =
            "COPIED ✓";


        setTimeout(() => {

            button.textContent =
                original;

        }, 1800);

    } catch (error) {

        console.error(
            "Could not copy invite link:",
            error
        );

    }

}


window.copyInviteLink =
    copyInviteLink;


/* =========================================================
   INVITE BUTTONS
   ========================================================= */

function initInviteButtons() {

    $$('[data-action="copy-invite"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                () => copyInviteLink(button)
            );

        });

}


/* =========================================================
   WELCOME SCREEN
   ========================================================= */

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

            <p>SHONEN NEXUS</p>

            <h2>WELCOME TO THE CLUB!</h2>

            <p>ANIME × CHESS × COMMUNITY</p>

        </div>

    `;


    document.body.appendChild(
        screen
    );

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


    /*
     * Force reflow so the animation
     * can replay every time.
     */

    void screen.offsetWidth;


    screen.classList.add(
        "active"
    );


    clearTimeout(
        screen._welcomeTimeout
    );


    screen._welcomeTimeout =
        setTimeout(() => {

            screen.classList.remove(
                "active"
            );

        }, 2400);

}


window.showWelcome =
    showWelcome;


/* =========================================================
   WELCOME BUTTONS
   ========================================================= */

function initWelcomeButton() {

    $$('[data-action="welcome"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                showWelcome
            );

        });

}


/* =========================================================
   THEME SYSTEM
   ========================================================= */

function setTheme(theme) {

    if (
        !SHONEN_NEXUS.themes.includes(theme)
    ) {

        theme = "default";

    }


    /*
     * Remove all theme classes.
     */

    SHONEN_NEXUS.themes.forEach(
        themeName => {

            document.body.classList.remove(
                `theme-${themeName}`
            );

        }
    );


    /*
     * Default theme doesn't
     * actually need a class.
     */

    if (theme !== "default") {

        document.body.classList.add(
            `theme-${theme}`
        );

    }


    localStorage.setItem(
        "shonen-theme",
        theme
    );


    /*
     * Update theme controls.
     */

    $$("[data-theme]").forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.theme === theme
            );

        }
    );

}


window.setTheme =
    setTheme;


/* =========================================================
   INITIALIZE THEME
   ========================================================= */

function initTheme() {

    const saved =
        localStorage.getItem(
            "shonen-theme"
        ) || "default";


    setTheme(saved);


    $$("[data-theme]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    setTheme(
                        button.dataset.theme
                    );

                }
            );

        });

}


/* =========================================================
   KEYBOARD SHORTCUTS
   ========================================================= */

function initKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            const active =
                document.activeElement;

            const tag =
                active?.tagName;


            /*
             * Don't interfere with typing.
             */

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT" ||
                active?.isContentEditable
            ) {

                return;

            }


            if (event.key === "Home") {

                event.preventDefault();

                scrollToTop();

            }


            if (event.key === "End") {

                event.preventDefault();

                scrollToBottom();

            }


            if (
                event.key.toLowerCase() === "g"
            ) {

                showWelcome();

            }

        }
    );

}


/* =========================================================
   CLUB LINKS
   ========================================================= */

function initClubLinks() {

    $$("[data-club-link]")
        .forEach(link => {

            link.href =
                SHONEN_NEXUS.clubUrl;

        });

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

    initNavigation();

    initActiveNavigation();

    initScrollState();

    initScanline();

    initFocusMode();

    initInviteButtons();

    initWelcomeButton();

    initTheme();

    initKeyboardShortcuts();

    initClubLinks();

}


/* =========================================================
   START
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init,
        { once: true }
    );

} else {

    init();

}