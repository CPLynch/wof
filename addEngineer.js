const engineers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const atLeast2in2weeks = true;
const noConsecutive = false;
const noSameDay = false;

function getMostRecentTwoWeekPeriod(shifts) {
    return shifts.slice(-((shifts.length % 10) + 10))
}

function onlyThoseLessThan2(shiftsInArray) {
    let lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftsInArray);
    return engineers.filter(function (engineer) {
        if (lastTwoWeeks.filter(s => s == engineer).length < 2) {
            return true;
        } else {
            return false;
        }
    })
}

function onlyThoseNotOnSameDay(shiftsToCheckThrough, eligible) {
    let eligibleToReturn = eligible.filter(function (engineer) {
        if ((shiftsToCheckThrough.length % 2) === 1) {
            elem = shiftsToCheckThrough[shiftsToCheckThrough.length - 1]
            if (engineer == elem) {
                return false;
            }
        }
        return true;
    });


    // Test for edge case where there would be a double shift forced into final slot
    if (atLeast2in2weeks) { //move into own function - make dependant on both rules active
        let lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftsToCheckThrough);
        let noShiftYet = eligibleToReturn.filter(function (engineer) {
            if (lastTwoWeeks.filter(s => s == engineer).length === 0) {
                return true;
            } else {
                return false;
            }
        })
        if (noShiftYet.length > 0) {
            numberOfDays = Math.floor(((20 - lastTwoWeeks.length) / 2));
            if ((numberOfDays - 1) <= Math.ceil(noShiftYet / 2)) {
                console.log('ltw', lastTwoWeeks, 'noSY', noShiftYet)
                return noShiftYet;
            }
        }
    }


    return eligibleToReturn;

}


function notIfInPreviousDay(shiftArr, eligible) {
    let lastTwoWeeks = getMostRecentTwoWeekPeriod(shiftArr);
    let lastDayShifts
    if (lastTwoWeeks.length % 2) {
        lastDayShifts = lastTwoWeeks.slice(-3, -1);
    } else {
        lastDayShifts = lastTwoWeeks.slice(-2);
    }
    let stillEligible = eligible.filter(engineer => !(lastDayShifts.includes(engineer)));
    return stillEligible;
}

function earlyToAvoidConsecutiveDay(shiftArray, eligible) {

}


module.exports = {
    addEngineer: function (shiftArray) {
        let eligible = engineers;
        if (atLeast2in2weeks) {
            eligible = onlyThoseLessThan2(shiftArray);
        }
        if (noSameDay) {
            eligible = onlyThoseNotOnSameDay(shiftArray, eligible);
        }
        if (noConsecutive) {
            eligible = notIfInPreviousDay(shiftArray, eligible);
        }
        var newE = eligible[Math.floor(Math.random() * eligible.length)];
        return shiftArray.concat([newE]);
    }
}
