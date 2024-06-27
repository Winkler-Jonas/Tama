


const getTaskByID = (taskID, taskArray) => {
    return taskArray.find(obj => obj.id === taskID)
}

const createDaily = (taskDesc, date, focus) => {
    return {
        description: taskDesc,
        repeat: 'never',
        start_date: date,
        end_date: date,
        category: focus,
        important: 0,
        done: true,
        daily: true
    }
}

/**
 * Function converts (range from addTask to actual dates)
 *
 * @param endDateInt index of selected
 * @param startDate the startDate (actual date used for calculation)
 * @param weekStart either 1 monday or 0 sunday
 * @return {*|Date} appropriate endDate as Date-object
 */
const formatEndDate = (endDateInt, startDate, weekStart) => {
    const startDateCpy = new Date(startDate)
    let endDate = new Date(startDate);

    switch (endDateInt) {
        case 1:
            // Next day
            endDate.setDate(startDateCpy.getDate() + 1);
            return endDate;
        case 2:
            // End of the week
            let dayOfWeek = startDateCpy.getDay();
            let daysToAdd = (6 + weekStart) - dayOfWeek;
            endDate.setDate(startDateCpy.getDate() + daysToAdd);
            return endDate;
        case 3:
            // End of the month
            endDate.setMonth(startDateCpy.getMonth() + 1, 0);
            return endDate;
        case 4:
            // End of the year
            endDate.setFullYear(startDateCpy.getFullYear(), 11, 31);
            return endDate;
        default:
            // same day
            return new Date(startDateCpy);
    }
}

export {
    createDaily,
    getTaskByID,
    formatEndDate
}