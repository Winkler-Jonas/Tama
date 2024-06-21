
const week = {
    'sun': 0,
    'mon': 1,
    'tue': 2,
    'wed': 3,
    'thu': 4,
    'fri': 5,
    'sat': 6
}

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
            year: current.year
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
        return {day: num % range || range, year: year++}
    }
    else if (num < 1) {
        return {day: num +range, year: year--};
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
    const startDate = new Date(year, 0);
    startDate.setDate(startDate.getDate() + n - 1);
    return startDate;
}

/**
 * Convert Date() to dayOfTheYearNr.
 *
 * @return {number}
 */
const getCurrentDayNumber = (date = new Date()) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const diff = date - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) + 1;  // Use Math.floor to round down
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
    return getCurrentWeek(getNthDayOfYear(year, dayOfTheYear), weekStart)
}

const getPreviousWeek = (dayOfTheYear, year, weekStart) => {
    return getCurrentWeek(getNthDayOfYear(year, dayOfTheYear), weekStart)
}

export {
    getNthDayOfYear,
    getCurrentDayNumber,
    getNextWeek,
    getCurrentWeek,
    getPreviousWeek,
}