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


/* dom helpers */

const $ = (selector, parent = document) =>
    parent.querySelector(selector);

const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


/* page detection */

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .replace(".html", "")
        .toLowerCase() || "index";


const PAGE = {
    home: currentPage === "index",
    notes: currentPage === "notes",
    announcements: currentPage === "announcements",
    forums: currentPage === "forums",
    events: currentPage === "events",
    registry: currentPage === "registry",
    command: currentPage === "command",
    social: currentPage === "social"
};


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

        if (navOverlay) {
            navOverlay.classList.add("visible");
        }

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "nav-open"
        );
    }


    function closeMenu() {

        sideNav.classList.remove("open");

        if (navOverlay) {
            navOverlay.classList.remove("visible");
        }

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "nav-open"
        );
    }


    function toggleMenu() {

        if (sideNav.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }

    }


    menuToggle.addEventListener(
        "click",
        toggleMenu
    );


    if (navClose) {

        navClose.addEventListener(
            "click",
            closeMenu
        );

    }


    if (navOverlay) {

        navOverlay.addEventListener(
            "click",
            closeMenu
        );

    }


    /*
     * Close the drawer after selecting
     * a navigation link.
     */

    $$(".nav-link").forEach(link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    });


    /*
     * ESC closes the navigation.
     */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        }
    );

}


/* ============================================
   ACTIVE NAVIGATION LINK
   ============================================ */

function initActiveNavigation() {

    const navLinks =
        $$(".nav-link");

    navLinks.forEach(link => {

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


/* ============================================
   SCROLL CONTROLS
   ============================================ */

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


/* ============================================
   SCROLL POSITION
   ============================================ */

function initScrollState() {

    function update() {

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
        update,
        { passive: true }
    );


    update();

}


/* ============================================
   SCANLINE SYSTEM
   ============================================ */

function initScanline() {

    const overlay =
        $("#scanlineOverlay");

    if (!overlay) {
        return;
    }


    /*
     * Restore previous setting.
     */

    const saved =
        localStorage.getItem(
            "shonen-scanline"
        );


    if (saved === "true") {

        overlay.classList.add(
            "active"
        );

    }


    /*
     * Any button using:
     *
     * data-action="scanline"
     *
     * will toggle the effect.
     */

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


/* ============================================
   FOCUS MODE
   ============================================ */

function initFocusMode() {

    $$('[data-action="focus"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document.body.classList.toggle(
                        "focus-mode"
                    );


                    button.classList.toggle(
                        "active"
                    );

                }
            );

        });

}


/* ============================================
   COPY INVITE LINK
   ============================================ */

async function copyInviteLink(button = null) {

    try {

        await navigator.clipboard.writeText(
            SHONEN_NEXUS.inviteUrl
        );


        if (button) {

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

        }

    } catch (error) {

        /*
         * Clipboard API may be unavailable
         * in certain iframe/security contexts.
         */

        console.error(
            "Could not copy invite link:",
            error
        );

    }

}


window.copyInviteLink =
    copyInviteLink;


/* ============================================
   AUTO-BIND INVITE BUTTONS
   ============================================ */

function initInviteButtons() {

    $$('[data-action="copy-invite"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                () => copyInviteLink(button)
            );

        });

}


/* ============================================
   WELCOME SCREEN
   ============================================ */

function createWelcomeScreen() {

    /*
     * Don't create duplicates.
     */

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
                WELCOME TO THE CLUB!
            </h2>

            <p>
                ANIME × CHESS × COMMUNITY
            </p>

        </div>

    `;


    document.body.appendChild(
        screen
    );

}


/* ============================================
   WELCOME EFFECT
   ============================================ */

function showWelcome() {

    createWelcomeScreen();


    const screen =
        $("#welcomeScreen");


    if (!screen) {
        return;
    }


    screen.classList.add(
        "active"
    );


    /*
     * Automatically dismiss.
     */

    setTimeout(() => {

        screen.classList.remove(
            "active"
        );

    }, 2400);

}


window.showWelcome =
    showWelcome;


/* ============================================
   WELCOME BUTTON
   ============================================ */

function initWelcomeButton() {

    $$('[data-action="welcome"]')
        .forEach(button => {

            button.addEventListener(
                "click",
                showWelcome
            );

        });

}


/* ============================================
   THEME SYSTEM
   ============================================ */

function setTheme(theme) {

    if (
        !SHONEN_NEXUS.themes.includes(
            theme
        )
    ) {

        theme = "default";

    }


    /*
     * Remove previous theme classes.
     */

    SHONEN_NEXUS.themes.forEach(
        themeName => {

            document.body.classList.remove(
                `theme-${themeName}`
            );

        }
    );


    /*
     * Apply new theme.
     */

    document.body.classList.add(
        `theme-${theme}`
    );


    /*
     * Persist theme.
     */

    localStorage.setItem(
        "shonen-theme",
        theme
    );


    /*
     * Update theme buttons.
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


/* ============================================
   INITIALIZE THEME
   ============================================ */

function initTheme() {

    const saved =
        localStorage.getItem(
            "shonen-theme"
        ) || "default";


    setTheme(saved);


    /*
     * Theme buttons can simply use:
     *
     * data-theme="bleach"
     */

    $$("[data-theme]").forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    setTheme(
                        button.dataset.theme
                    );

                }
            );

        }
    );

}


/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */

function initKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * Don't hijack typing fields.
             */

            const tag =
                document.activeElement?.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {

                return;

            }


            /*
             * Home
             */

            if (event.key === "Home") {

                event.preventDefault();

                scrollToTop();

            }


            /*
             * End
             */

            if (event.key === "End") {

                event.preventDefault();

                scrollToBottom();

            }


            /*
             * G = Welcome
             */

            if (
                event.key.toLowerCase() === "g"
            ) {

                showWelcome();

            }

        }
    );

}


/* ============================================
   EXTERNAL CHESS.COM LINK
   ============================================ */

function initClubLinks() {

    $$("[data-club-link]")
        .forEach(link => {

            link.href =
                SHONEN_NEXUS.clubUrl;

        });

}


/* ============================================
   PAGE INITIALIZATION
   ============================================ */

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


/* ============================================
   START
   ============================================ */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        init
    );

} else {

    init();

}