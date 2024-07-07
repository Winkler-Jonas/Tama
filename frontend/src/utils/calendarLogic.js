/**
 * @param date Date()
 *
 * @return DateString dd.mm.yyyy
 */
const formatDate = (date) => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    return formatter.format(date).replace(/\//g, '.');
}

const formatToDjangoDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1),  // getMonth() returns 0-based index, add 1 for correct month
        day = '' + d.getDate(),
        year = d.getFullYear();

    // Pad month and day with a zero if they are less than 10
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

/**
 * @param start {day: dayOfTheYear {Number}, year: yearNr {Number}}
 *
 * @return {{string: *, day_dY: *, day_d: *, day_s: *}[]}
 */
const buildWeek = (start) => {
    let retValue = []
    for (let i = 0; i < 7; i++) {
        const current = wrapYearDays(start.day + i, start.year)
        const date = getNthDayOfYear(current.year, current.day)

        retValue.push({
            day_short: date.toLocaleDateString('en-US', {weekday: 'short'}).toLowerCase(),
            day_date: date.getDate(),
            year_day: current.day,
            date_str: formatDate(date),
            date: date,
            year: current.year,
            month: date.getMonth()
        })
    }
    return retValue
}

/**
 * Convert number like 366 == 1 || 0 == 365
 *
 *
 */
const wrapYearDays = (num, year) => {
    const range = ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) ? 366 : 365;

    if (num > range) {
        return {day: num % range || range, year: ++year}
    }
    else if (num < 1) {
        return {day: num + range, year: --year};
    }
    return {day: num, year: year};
}

/**
 * Convert yearDay + year into Date
 *
 * @param year
 * @param n day of the year
 * @return {Date}
 */
const getNthDayOfYear = (year, n) => {
    let cumDays = 0;
    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
        const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
        if (cumDays + daysInMonth >= n) {
            return new Date(year, monthIdx, n - cumDays);
        }
        cumDays += daysInMonth;
    }
};

/**
 * Convert Date() to dayOfTheYearNr.
 *
 * @return {number}
 */
const getCurrentDayNumber = (date = new Date()) => {
    return  Array.from({length: date.getMonth()}, (_, i) =>
        new Date(date.getFullYear(), i + 1, 0).getDate()
    ).reduce((partial, a) => partial + a, date.getDate())
}

/**
 *
 * @param today Date()
 * @param weekStart Either 0 (Sunday) or 1 (Monday)
 */
const getCurrentWeek = (today = new Date, weekStart) => {
    const firstDay = getCurrentDayNumber(today) - today.getDay() + weekStart
    let yearNr = today.getFullYear()

    return buildWeek(wrapYearDays(firstDay, yearNr))
}

const getNextWeek = (dayOfTheYear, year, weekStart) => {
    const correctedNumber = wrapYearDays(dayOfTheYear + 2, year)
    return getCurrentWeek(getNthDayOfYear(correctedNumber.year, correctedNumber.day), weekStart)
}

const getPreviousWeek = (dayOfTheYear, year, weekStart) => {
    const correctedNumber = wrapYearDays(dayOfTheYear - 2, year)
    return getCurrentWeek(getNthDayOfYear(correctedNumber.year, correctedNumber.day), weekStart)
}

function getCurrentMonth(date = new Date(), weekStart) {
    const weeks = [];
    date.setDate(1);
    date = new Date(date);

    let previousWeek = getPreviousWeek(getCurrentDayNumber(date), date.getFullYear(), weekStart)

    weeks.push(previousWeek);

    for (let i = 0; i < 5; i++) {
        let lastDayOfCurrentWeek = previousWeek[previousWeek.length - 1];
        let nextWeek = getNextWeek(lastDayOfCurrentWeek.year_day + 1, lastDayOfCurrentWeek.year, weekStart);
        weeks.push(nextWeek);
        previousWeek = nextWeek;
    }
    return weeks;
}

const formatToDateString = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
}

const getNextMonth = (dayOfTheYear, year, weekStart) => {
    const correctedNumber = wrapYearDays(dayOfTheYear + 2, year)
    return getCurrentMonth(getNthDayOfYear(correctedNumber.year, correctedNumber.day), weekStart)
}

const getPreviousMonth = (dayOfTheYear, year, weekStart) => {
    const correctedNumber = wrapYearDays(dayOfTheYear - 2, year)
    return getCurrentMonth(getNthDayOfYear(correctedNumber.year, correctedNumber.day), weekStart)
}

const isEqual = (dateA, dateB) => {
    return toDateString(dateA) === toDateString(dateB)
}

function toDateString(date) {
    return date.toISOString().split('T')[0];
}

function isDateBefore(date1, date2) {
    return toDateString(date1) < toDateString(date2);
}

function isDateAfter(date1, date2) {
    return toDateString(date1) > toDateString(date2);
}

const isGreaterEqual = (date1, date2) => {
    const dateA = date1 instanceof Date ? date1 : new Date(date1)
    const dateB = date2 instanceof Date ? date2 : new Date(date2)
    const dayAYear = dateA.getFullYear();
    const dayAMonth = dateA.getMonth();
    const dayADay = dateA.getDate();

    const dayBYear = dateB.getFullYear();
    const dayBMonth = dateB.getMonth();
    const dayBDay = dateB.getDate();

    if (dayAYear > dayBYear) {
        return false;
    } else if (dayAYear < dayBYear) {
        return true;
    } else {
        if (dayAMonth > dayBMonth) {
            return false;
        } else if (dayAMonth < dayBMonth) {
            return true;
        } else {
            return dayADay <= dayBDay;
        }
    }
};

const findIndexOfDate = (array, date) => {
    const formattedDate = formatDate(date)
    return array.findIndex(day => formatDate(day.date) === formattedDate)
}

export {
    isEqual,
    formatDate,
    isGreaterEqual,
    isDateBefore,
    isDateAfter,
    formatToDateString,
    formatToDjangoDate,
    findIndexOfDate,
    getNextWeek,
    getCurrentWeek,
    getPreviousWeek,
    getCurrentMonth,
    getNextMonth,
    getPreviousMonth
}