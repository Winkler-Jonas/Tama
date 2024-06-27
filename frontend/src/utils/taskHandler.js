


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

export {
    createDaily,
    getTaskByID
}