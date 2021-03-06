const config = require('./config');
const engineers = Object.keys(config.engineers).map(id => parseInt(id))


//Why didn't I try making the rules changeable? I have made these rules functionally independant of one another so they can be removed separately. 
//Trying to make these work to be compatible with any unlikely, unknown, future changes may well take longer than adding or rewriting a single rule.


/**
 * @param array - all shifts
 * @return array - two most recent, full, weeks 
 **/
function getMostRecentTwoWeekPeriod(shifts) {
    return shifts.slice(-((shifts.length % 10) + 10))
}


/**
 * @param array - all shifts
 * @param array - all eligible engineers
 * @return array - remaining eligible engineers
 **/
function onlyThoseLessThan2(shiftArray, eligible) {
    const lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftArray);
    return eligible.filter(function (engineer) {
        if (lastTwoWeeks.filter(s => s == engineer).length < 2) {
            return true;
        } else {
            return false;
        }
    })
}


/**
 * @param array - all shifts
 * @param array - all eligible engineers
 * @return array - remaining eligible engineers
 **/
function onlyThoseNotOnSameDay(shiftArray, eligible) {
    return eligible.filter(function (engineer) {
        if ((shiftArray.length % 2) === 1) {
            const elem = shiftArray[shiftArray.length - 1]
            if (engineer == elem) {
                return false;
            }
        }
        return true;
    });
}


/**
 * @param array - all shifts
 * @param array - all eligible engineers
 * @return array - remaining eligible engineers
 **/
function noSameDay2in2WeeksEdgeCases(shiftArray, eligible) {
    const lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftArray);
    const noShiftYet = eligible.filter(function (engineer) {
        if (lastTwoWeeks.filter(s => s == engineer).length === 0) {
            return true;
        } else {
            return false;
        }
    })
    if (noShiftYet.length > 0) {
        const numberOfDays = Math.floor(((20 - lastTwoWeeks.length) / 2));
        if ((numberOfDays - 1) <= Math.ceil(noShiftYet / 2)) {
            return noShiftYet;
        }
    }
    return eligible;
}


/**
 * @param array - all shifts
 * @param array - all eligible engineers
 * @return array - remaining eligible engineers
 **/
function notIfInPreviousDay(shiftArray, eligible) {
    const lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftArray);
    let lastDayShifts;
    if (lastTwoWeeks.length % 2) {
        lastDayShifts = lastTwoWeeks.slice(-3, -1);
    } else {
        lastDayShifts = lastTwoWeeks.slice(-2);
    }
    return eligible.filter(engineer => !(lastDayShifts.includes(engineer)));
}


/**
 * @param array - all shifts
 * @param array - all eligible engineers
 * @return array - remaining eligible engineers
 **/
function noConsecutive2in2WeeksEdgeCases(shiftArray, eligible) {
    const lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftArray);
    const shiftsLeft = 20 - lastTwoWeeks.length;
    const noShiftYet = eligible.filter(function (engineer) {
        if (lastTwoWeeks.filter(s => s == engineer).length === 0) {
            return true;
        } else {
            return false;
        }
    });
    if (noShiftYet.length > 0) {
        //for every engineer who hasn't done a shift there needs to be a seperation of 4 shifts to maintain non-consecutive days.  
        if ((noShiftYet.length + 4) == shiftsLeft) {
            return noShiftYet;
        }
    }
    return eligible;
}


/**
 * exports method needed to add a new shift 
 * @param array - all shifts
 * @return function - all shifts with one new
 **/
module.exports = {
    addEngineer: function (shiftArray) {
        let eligible = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        if (config.atLeast2in2weeks) {
            eligible = onlyThoseLessThan2(shiftArray, eligible);
        }
        if (config.noSameDay) {
            eligible = onlyThoseNotOnSameDay(shiftArray, eligible);
        }
        if (config.atLeast2in2weeks && config.noSameDay) {
            eligible = noSameDay2in2WeeksEdgeCases(shiftArray, eligible);
        }
        if (config.noConsecutive) {
            eligible = notIfInPreviousDay(shiftArray, eligible);
        }
        if (config.atLeast2in2weeks && config.noConsecutive) {
            eligible = noConsecutive2in2WeeksEdgeCases(shiftArray, eligible);
        }
        const newE = eligible[Math.floor(Math.random() * eligible.length)];
        return shiftArray.concat([newE]);
    }
}
