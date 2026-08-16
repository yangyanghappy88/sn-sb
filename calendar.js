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
        CALENDAR_CONFIG.defaultTimezone,

    detectedTimezone:
        null,

    initialized:
        false

};


/* detect */

function detectLocalTimezone() {

    if (CalendarState.detectedTimezone) {

        return CalendarState.detectedTimezone;

    }


    try {

        const timezone =
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone;


        /*
         * Make sure the browser actually returned
         * a valid IANA timezone.
         */

        if (
            typeof timezone === "string" &&
            timezone.length > 0
        ) {

            CalendarState.detectedTimezone =
                timezone;

            return timezone;

        }

    } catch (error) {

        console.warn(
            "Unable to detect local timezone:",
            error
        );

    }


    /*
     * Fallback.
     */

    CalendarState.detectedTimezone =
        "UTC";

    return "UTC";

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

    let saved = null;


    try {

        saved =
            localStorage.getItem(
                CALENDAR_CONFIG.storageKey
            );

    } catch (error) {

        console.warn(
            "Unable to read saved timezone:",
            error
        );

    }


    if (
        saved === "local" ||
        saved ===
        CALENDAR_CONFIG.tokyoTimezone
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

    try {

        localStorage.setItem(
            CALENDAR_CONFIG.storageKey,
            CalendarState.selectedTimezone
        );

    } catch (error) {

        console.warn(
            "Unable to save timezone:",
            error
        );

    }

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

        console.warn(
            "Unsupported calendar timezone:",
            timezone
        );

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
   FORMAT DATE IN ACTIVE TIMEZONE
   ============================================ */

function formatCalendarDate(
    date
) {

    return new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone:
                getActiveTimezone(),

            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
    ).format(date);

}


/* ============================================
   EVENT DATE KEY
   ============================================ */

function getDateKey(
    date
) {

    return formatCalendarDate(
        date
    );

}


/* ============================================
   CHECK IF DAY IS TODAY
   ============================================ */

function isTodayInTimezone(
    year,
    month,
    day
) {

    const today =
        new Date();


    const todayKey =
        getDateKey(
            today
        );


    const targetKey =
        `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    return todayKey === targetKey;

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
            document.createElement(
                "div"
            );


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
            document.createElement(
                "button"
            );


        cell.type =
            "button";


        cell.className =
            "calendar-day";


        const today =
            isTodayInTimezone(
                year,
                month,
                day
            );


        if (today) {

            cell.classList.add(
                "today"
            );

        }


        cell.innerHTML = `

            <span class="calendar-number">
                ${day}
            </span>

        `;


        calendar.appendChild(
            cell
        );

    }

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
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    toggleCalendarTimezone
                );

            }
        );

}


/* ============================================
   EVENT NAVIGATION
   ============================================ */

function initCalendarNavigation() {

    document
        .querySelectorAll(
            '[data-calendar="previous"]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeCalendarMonth(
                            -1
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            '[data-calendar="next"]'
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeCalendarMonth(
                            1
                        );

                    }
                );

            }
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
        getActiveTimezone,

    detectTimezone:
        detectLocalTimezone

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


/* start */

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