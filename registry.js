const REGISTRY_CONFIG = {

    club: "shonen-nexus",

    apiMode: "direct",

    proxyEndpoint:
        "/api/shonen-nexus",

    newestLimit: 8,

    refreshInterval:
        30 * 60 * 1000

};


/* state */

const Registry = {

    club: null,

    members: [],

    newestMembers: [],

    initialized: false,

    loading: false,

    lastUpdated: null

};


/* api endpoints */

const REGISTRY_API = {

    club:
        `https://api.chess.com/pub/club/${REGISTRY_CONFIG.club}`,

    members:
        `https://api.chess.com/pub/club/${REGISTRY_CONFIG.club}/members`

};


/* dom */

const registry$ = selector =>
    document.querySelector(selector);


/* ============================================
   API FETCH
   ============================================ */

async function registryFetch(
    endpoint
) {

    let url;


    if (
        REGISTRY_CONFIG.apiMode ===
        "proxy"
    ) {

        url =
            REGISTRY_CONFIG.proxyEndpoint +
            endpoint;

    } else {

        url =
            endpoint;

    }


    const response =
        await fetch(
            url,
            {
                method: "GET",

                headers: {
                    "Accept":
                        "application/json"
                },

                cache: "no-cache"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Registry API error: ${response.status}`
        );

    }


    return response.json();

}


/* ============================================
   LOAD CLUB
   ============================================ */

async function loadClubData() {

    return registryFetch(
        REGISTRY_API.club
    );

}


/* ============================================
   LOAD MEMBERS
   ============================================ */

async function loadMemberData() {

    return registryFetch(
        REGISTRY_API.members
    );

}


/* ============================================
   NORMALIZE MEMBERS
   ============================================ */

function normalizeMembers(
    memberData
) {

    /*
     * Chess.com's club member response may
     * contain activity-grouped arrays.
     *
     * Combine them and remove duplicates.
     */

    const groups = [

        ...(Array.isArray(
            memberData.weekly
        )
            ? memberData.weekly
            : []),

        ...(Array.isArray(
            memberData.monthly
        )
            ? memberData.monthly
            : []),

        ...(Array.isArray(
            memberData.all_time
        )
            ? memberData.all_time
            : [])

    ];


    const unique =
        new Map();


    groups.forEach(member => {

        if (
            !member ||
            !member.username
        ) {

            return;

        }


        const username =
            member.username;


        const key =
            username.toLowerCase();


        /*
         * If the same user appears in
         * multiple activity groups, retain
         * the entry with the newest join date.
         */

        const existing =
            unique.get(key);


        if (
            !existing ||
            Number(member.joined || 0) >
            Number(existing.joined || 0)
        ) {

            unique.set(
                key,
                member
            );

        }

    });


    return [...unique.values()];

}


/* ============================================
   SORT NEWEST MEMBERS
   ============================================ */

function getNewestMembers(
    members
) {

    return [...members]

        .sort(
            (a, b) => {

                return (
                    Number(b.joined || 0) -
                    Number(a.joined || 0)
                );

            }
        )

        .slice(
            0,
            REGISTRY_CONFIG.newestLimit
        );

}


/* ============================================
   FORMAT JOIN DATE
   ============================================ */

function formatJoinDate(
    timestamp
) {

    if (!timestamp) {

        return "JOIN DATE UNKNOWN";

    }


    const date =
        new Date(
            Number(timestamp) * 1000
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "JOIN DATE UNKNOWN";

    }


    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    ).format(date);

}


/* ============================================
   MEMBER URL
   ============================================ */

function getMemberURL(
    username
) {

    return (
        "https://www.chess.com/member/" +
        encodeURIComponent(username)
    );

}


/* ============================================
   UPDATE MEMBER COUNT
   ============================================ */

function updateMemberCount() {

    const element =
        registry$(
            '[data-registry="member-count"]'
        );


    if (!element) {
        return;
    }


    if (
        !Registry.club ||
        typeof Registry.club.members_count !==
        "number"
    ) {

        element.textContent =
            "—";

        return;

    }


    element.textContent =
        Registry.club.members_count
            .toLocaleString();

}


/* ============================================
   RENDER NEWEST MEMBERS
   ============================================ */

function renderNewestMembers() {

    const container =
        registry$(
            '[data-registry="newest"]'
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Registry.newestMembers.length
    ) {

        container.innerHTML = `
            <div class="registry-empty">
                NO MEMBER DATA
            </div>
        `;

        return;

    }


    Registry.newestMembers.forEach(
        (member, index) => {

            const item =
                document.createElement("a");


            item.className =
                "registry-member";


            item.href =
                getMemberURL(
                    member.username
                );


            item.target =
                "_blank";


            item.rel =
                "noopener noreferrer";


            item.innerHTML = `

                <span class="registry-index">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <span class="registry-member-info">

                    <strong>
                        ${escapeRegistryHTML(
                            member.username
                        )}
                    </strong>

                    <small>
                        JOINED
                        ${formatJoinDate(
                            member.joined
                        )}
                    </small>

                </span>

                <span class="registry-arrow">
                    ↗
                </span>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* ============================================
   RANDOM MEMBER
   ============================================ */

function getRandomMember() {

    if (
        !Registry.members.length
    ) {

        return null;

    }


    const index =
        Math.floor(
            Math.random() *
            Registry.members.length
        );


    return Registry.members[index];

}


/* ============================================
   MEMBER DICE
   ============================================ */

function randomMember() {

    const member =
        getRandomMember();


    if (!member) {

        updateRegistryStatus(
            "NO MEMBERS"
        );

        return;

    }


    const result =
        registry$(
            '[data-registry="random-result"]'
        );


    if (result) {

        result.innerHTML = `

            <span class="random-label">
                MEMBER SELECTED
            </span>

            <strong>
                ${escapeRegistryHTML(
                    member.username
                )}
            </strong>

        `;

    }


    const profileButton =
        registry$(
            '[data-registry="random-profile"]'
        );


    if (profileButton) {

        profileButton.href =
            getMemberURL(
                member.username
            );

        profileButton.classList.add(
            "visible"
        );

    }


    /*
     * Small visual roll effect.
     */

    const dice =
        registry$(
            '[data-action="member-dice"]'
        );


    if (dice) {

        dice.classList.add(
            "rolling"
        );


        setTimeout(() => {

            dice.classList.remove(
                "rolling"
            );

        }, 450);

    }

}


window.randomMember =
    randomMember;


/* ============================================
   STATUS
   ============================================ */

function updateRegistryStatus(
    status
) {

    const element =
        registry$(
            '[data-registry="status"]'
        );


    if (element) {

        element.textContent =
            status;

    }

}


/* ============================================
   LAST UPDATED
   ============================================ */

function updateRegistryTimestamp() {

    const element =
        registry$(
            '[data-registry="updated"]'
        );


    if (!element) {
        return;
    }


    if (!Registry.lastUpdated) {

        element.textContent =
            "NOT YET UPDATED";

        return;

    }


    element.textContent =
        "UPDATED " +
        new Intl.DateTimeFormat(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit"
            }
        ).format(
            Registry.lastUpdated
        );

}


/* ============================================
   LOAD REGISTRY
   ============================================ */

async function loadRegistry() {

    if (Registry.loading) {
        return;
    }


    Registry.loading =
        true;


    updateRegistryStatus(
        "SYNCING..."
    );


    try {

        /*
         * These are serial rather than parallel
         * requests. That is friendlier to the
         * PubAPI and avoids unnecessary bursts.
         */

        const club =
            await loadClubData();


        const memberData =
            await loadMemberData();


        Registry.club =
            club;


        Registry.members =
            normalizeMembers(
                memberData
            );


        Registry.newestMembers =
            getNewestMembers(
                Registry.members
            );


        Registry.lastUpdated =
            new Date();


        updateMemberCount();

        renderNewestMembers();

        updateRegistryTimestamp();

        updateRegistryStatus(
            "ONLINE"
        );


    } catch (error) {

        console.error(
            "Shonen Nexus registry error:",
            error
        );


        updateRegistryStatus(
            "OFFLINE"
        );

    } finally {

        Registry.loading =
            false;

    }

}


/* ============================================
   AUTO REFRESH
   ============================================ */

function initRegistryRefresh() {

    setInterval(
        () => {

            loadRegistry();

        },
        REGISTRY_CONFIG.refreshInterval
    );

}


/* ============================================
   DICE BUTTON
   ============================================ */

function initMemberDice() {

    $$registry(
        '[data-action="member-dice"]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            randomMember
        );

    });

}


/* ============================================
   SAFE QUERY SELECTOR
   ============================================ */

function $$registry(
    selector
) {

    return [
        ...document.querySelectorAll(
            selector
        )
    ];

}


/* ============================================
   ESCAPE HTML
   ============================================ */

function escapeRegistryHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* ============================================
   PUBLIC REGISTRY API
   ============================================ */

window.ShonenRegistry = {

    load:
        loadRegistry,

    random:
        randomMember,

    getMembers: () =>
        Registry.members,

    getClub: () =>
        Registry.club,

    getNewest: () =>
        Registry.newestMembers

};


/* ============================================
   INITIALIZE
   ============================================ */

async function initRegistry() {

    /*
     * Don't run on pages that don't contain
     * registry markup.
     */

    if (
        !document.querySelector(
            "[data-registry-page]"
        )
    ) {

        return;

    }


    if (
        Registry.initialized
    ) {

        return;

    }


    Registry.initialized =
        true;


    initMemberDice();

    await loadRegistry();

    initRegistryRefresh();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initRegistry
    );

} else {

    initRegistry();

}