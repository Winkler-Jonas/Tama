/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import {formatToDjangoDate, isEqual} from "@/utils/calendarLogic.js";


const getTaskByID = (taskID, taskArray) => {
    return taskArray.find(obj => obj.id === taskID)
}

const convertTask = (task, date, usrFocus) => {
    const isDaily = !!task.desc

    return isDaily ? {
        obj: {
            description: task.desc,
            repeat: 'never',
            start_date: new Date(date),
            end_date: new Date(date),
            category: usrFocus,
            important: 0,
            done: false,
            daily: true
        },
        functions: ['done', 'edit', 'move']
    } : {
        obj: {
            description: task.description,
            repeat: task.repeat,
            start_date: new Date(task.start_date),
            end_date: new Date(task.end_date),
            category: task.category,
            important: 0,
            done: task.task_instances[formatToDjangoDate(date)] === 'done',
            stroke: task.task_instances[formatToDjangoDate(date)] === 'cancelled',
            daily: false
        },
        functions: ['inProgress', 'done', 'stroke', 'subTask', 'edit', 'move', 'trash']
    }
}

const taskAltered = (taskA, taskB) => {
    let retVal = false

    for (let key in taskA) {
        if (taskA[key] instanceof Date) {
            retVal = !isEqual(taskA[key], taskB[key])
        } else {
            retVal = taskA[key] !== taskB[key]
        }
        if (retVal) {
            break
        }
    }
    return retVal
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
    taskAltered,
    convertTask,
    getTaskByID,
    formatEndDate
}