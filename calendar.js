const CALENDAR_CONFIG = {

    storageKey:
        "shonen-calendar-timezone",

    defaultTimezone:
        "local",

    tokyoTimezone:
        "Asia/Tokyo"

};


/* state */

const CalendarState = {

    currentDate:
        new Date(),

    selectedTimezone:
        "local",

    initialized:
        false

};

const CALENDAR_EVENTS = [

    {
        title:
            "Shonen Nexus Arena",

        date:
            "2026-08-20T19:00:00Z",

        type:
            "arena"
    },

    {
        title:
            "Anime Chess Night",

        date:
            "2026-08-23T20:00:00Z",

        type:
            "community"
    },

    {
        title:
            "One Piece Theme Night",

        date:
            "2026-08-28T21:00:00Z",

        type:
            "theme"
    }

];


/* ============================================
   DETECT LOCAL TIMEZONE
   ============================================ */

function detectLocalTimezone() {

    try {

        return (
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone
        ) || "UTC";

    } catch {

        return "UTC";

    }

}


/* ============================================
   GET ACTIVE TIMEZONE
   ============================================ */

function getActiveTimezone() {

    if (
        CalendarState.selectedTimezone ===
        "local"
    ) {

        return detectLocalTimezone();

    }


    return CalendarState.selectedTimezone;

}


/* ============================================
   LOAD SAVED TIMEZONE
   ============================================ */

function loadSavedTimezone() {

    const saved =
        localStorage.getItem(
            CALENDAR_CONFIG.storageKey
        );


    if (
        saved === "local" ||
        saved === CALENDAR_CONFIG.tokyoTimezone
    ) {

        CalendarState.selectedTimezone =
            saved;

    } else {

        CalendarState.selectedTimezone =
            CALENDAR_CONFIG.defaultTimezone;

    }

}


/* ============================================
   SAVE TIMEZONE
   ============================================ */

function saveTimezone() {

    localStorage.setItem(
        CALENDAR_CONFIG.storageKey,
        CalendarState.selectedTimezone
    );

}


/* ============================================
   SET TIMEZONE
   ============================================ */

function setCalendarTimezone(
    timezone
) {

    if (
        timezone !== "local" &&
        timezone !==
        CALENDAR_CONFIG.tokyoTimezone
    ) {

        return;

    }


    CalendarState.selectedTimezone =
        timezone;


    saveTimezone();

    updateTimezoneUI();

    renderCalendar();

}


/* ============================================
   TOGGLE TIMEZONE
   ============================================ */

function toggleCalendarTimezone() {

    if (
        CalendarState.selectedTimezone ===
        "local"
    ) {

        setCalendarTimezone(
            CALENDAR_CONFIG.tokyoTimezone
        );

    } else {

        setCalendarTimezone(
            "local"
        );

    }

}


window.setCalendarTimezone =
    setCalendarTimezone;

window.toggleCalendarTimezone =
    toggleCalendarTimezone;


/* ============================================
   MONTH NAVIGATION
   ============================================ */

function changeCalendarMonth(
    offset
) {

    CalendarState.currentDate =
        new Date(
            CalendarState.currentDate.getFullYear(),
            CalendarState.currentDate.getMonth() +
            offset,
            1
        );


    renderCalendar();

}


window.changeCalendarMonth =
    changeCalendarMonth;


/* ============================================
   GET DAYS IN MONTH
   ============================================ */

function getDaysInMonth(
    year,
    month
) {

    return new Date(
        year,
        month + 1,
        0
    ).getDate();

}


/* ============================================
   FIRST DAY OF MONTH
   ============================================ */

function getFirstDay(
    year,
    month
) {

    return new Date(
        year,
        month,
        1
    ).getDay();

}


/* ============================================
   FORMAT MONTH TITLE
   ============================================ */

function formatMonthTitle(
    date
) {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


/* ============================================
   EVENT DATE KEY
   ============================================ */

function getDateKey(
    date
) {

    const formatter =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone:
                    getActiveTimezone(),

                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );


    return formatter.format(
        date
    );

}


/* ============================================
   GET EVENTS FOR DAY
   ============================================ */

function getEventsForDay(
    year,
    month,
    day
) {

    const target =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    return CALENDAR_EVENTS.filter(
        event => {

            return (
                getDateKey(
                    new Date(event.date)
                ) === target
            );

        }
    );

}


/* ============================================
   FORMAT EVENT TIME
   ============================================ */

function formatEventTime(
    date
) {

    return new Intl.DateTimeFormat(
        undefined,
        {
            timeZone:
                getActiveTimezone(),

            hour: "numeric",

            minute: "2-digit"
        }
    ).format(date);

}


/* ============================================
   RENDER CALENDAR
   ============================================ */

function renderCalendar() {

    const calendar =
        document.querySelector(
            '[data-calendar="grid"]'
        );


    if (!calendar) {
        return;
    }


    const year =
        CalendarState.currentDate
            .getFullYear();


    const month =
        CalendarState.currentDate
            .getMonth();


    const days =
        getDaysInMonth(
            year,
            month
        );


    const firstDay =
        getFirstDay(
            year,
            month
        );


    const title =
        document.querySelector(
            '[data-calendar="month"]'
        );


    if (title) {

        title.textContent =
            formatMonthTitle(
                CalendarState.currentDate
            );

    }


    calendar.innerHTML = "";


    /*
     * Blank cells before the first day.
     */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");


        empty.className =
            "calendar-day empty";


        calendar.appendChild(
            empty
        );

    }


    /*
     * Actual days.
     */

    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const cell =
            document.createElement("button");


        cell.type =
            "button";


        cell.className =
            "calendar-day";


        const events =
            getEventsForDay(
                year,
                month,
                day
            );


        const today =
            new Date();


        const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;


        if (isToday) {

            cell.classList.add(
                "today"
            );

        }


        if (events.length) {

            cell.classList.add(
                "has-event"
            );

        }


        cell.innerHTML = `

            <span class="calendar-number">
                ${day}
            </span>

            ${
                events.length
                    ? `<span class="calendar-event-dot"></span>`
                    : ""
            }

        `;


        if (events.length) {

            cell.addEventListener(
                "click",
                () => {

                    showCalendarEvents(
                        events
                    );

                }
            );

        }


        calendar.appendChild(
            cell
        );

    }


    updateCalendarEventList();

}


/* ============================================
   EVENT LIST
   ============================================ */

function updateCalendarEventList() {

    const container =
        document.querySelector(
            '[data-calendar="events"]'
        );


    if (!container) {
        return;
    }


    const sorted =
        [...CALENDAR_EVENTS]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    container.innerHTML = "";


    sorted.forEach(
        event => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "calendar-event";


            const date =
                new Date(
                    event.date
                );


            item.innerHTML = `

                <div class="calendar-event-date">

                    <strong>
                        ${new Intl.DateTimeFormat(
                            undefined,
                            {
                                month: "short",
                                day: "numeric"
                            }
                        ).format(date)}
                    </strong>

                    <small>
                        ${formatEventTime(
                            date
                        )}
                    </small>

                </div>

                <div class="calendar-event-info">

                    <strong>
                        ${escapeCalendarHTML(
                            event.title
                        )}
                    </strong>

                    <small>
                        ${escapeCalendarHTML(
                            event.type ||
                            "event"
                        ).toUpperCase()}
                    </small>

                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* ============================================
   SHOW DAY EVENTS
   ============================================ */

function showCalendarEvents(
    events
) {

    if (!events.length) {
        return;
    }


    const event =
        events[0];


    const date =
        new Date(
            event.date
        );


    /*
     * Use a custom small event display
     * if the page provides one.
     */

    const display =
        document.querySelector(
            '[data-calendar="selected-event"]'
        );


    if (!display) {

        console.log(
            events
        );

        return;

    }


    display.innerHTML = events
        .map(
            item => `

                <div class="selected-calendar-event">

                    <strong>
                        ${escapeCalendarHTML(
                            item.title
                        )}
                    </strong>

                    <small>
                        ${formatEventTime(
                            new Date(
                                item.date
                            )
                        )}
                    </small>

                </div>

            `
        )
        .join("");

}


/* ============================================
   TIMEZONE UI
   ============================================ */

function updateTimezoneUI() {

    const timezone =
        getActiveTimezone();


    const label =
        document.querySelector(
            '[data-calendar="timezone"]'
        );


    if (label) {

        label.textContent =
            timezone;

    }


    const localButton =
        document.querySelector(
            '[data-calendar-timezone="local"]'
        );


    const tokyoButton =
        document.querySelector(
            '[data-calendar-timezone="tokyo"]'
        );


    if (localButton) {

        localButton.classList.toggle(
            "active",
            CalendarState.selectedTimezone ===
            "local"
        );

    }


    if (tokyoButton) {

        tokyoButton.classList.toggle(
            "active",
            CalendarState.selectedTimezone ===
            CALENDAR_CONFIG.tokyoTimezone
        );

    }

}


/* ============================================
   TIMEZONE BUTTONS
   ============================================ */

function initTimezoneButtons() {

    const localButton =
        document.querySelector(
            '[data-calendar-timezone="local"]'
        );


    const tokyoButton =
        document.querySelector(
            '[data-calendar-timezone="tokyo"]'
        );


    if (localButton) {

        localButton.addEventListener(
            "click",
            () => {

                setCalendarTimezone(
                    "local"
                );

            }
        );

    }


    if (tokyoButton) {

        tokyoButton.addEventListener(
            "click",
            () => {

                setCalendarTimezone(
                    CALENDAR_CONFIG.tokyoTimezone
                );

            }
        );

    }


    document
        .querySelectorAll(
            '[data-action="timezone-toggle"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                toggleCalendarTimezone
            );

        });

}


/* ============================================
   EVENT NAVIGATION
   ============================================ */

function initCalendarNavigation() {

    document
        .querySelectorAll(
            '[data-calendar="previous"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeCalendarMonth(
                        -1
                    );

                }
            );

        });


    document
        .querySelectorAll(
            '[data-calendar="next"]'
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    changeCalendarMonth(
                        1
                    );

                }
            );

        });

}


/* ============================================
   HTML ESCAPE
   ============================================ */

function escapeCalendarHTML(
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
   PUBLIC CALENDAR API
   ============================================ */

window.ShonenCalendar = {

    setTimezone:
        setCalendarTimezone,

    toggleTimezone:
        toggleCalendarTimezone,

    nextMonth:
        () =>
            changeCalendarMonth(1),

    previousMonth:
        () =>
            changeCalendarMonth(-1),

    refresh:
        renderCalendar,

    getTimezone:
        getActiveTimezone

};


/* ============================================
   INITIALIZATION
   ============================================ */

function initCalendar() {

    /*
     * Only initialize on a page that contains
     * the calendar.
     */

    if (
        !document.querySelector(
            "[data-calendar-page]"
        )
    ) {

        return;

    }


    if (
        CalendarState.initialized
    ) {

        return;

    }


    CalendarState.initialized =
        true;


    loadSavedTimezone();

    initTimezoneButtons();

    initCalendarNavigation();

    updateTimezoneUI();

    renderCalendar();

}


/* ============================================
   START
   ============================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initCalendar
    );

} else {

    initCalendar();

}