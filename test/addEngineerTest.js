const assert = require('chai').assert;
const addEngineer = require('../addEngineer').addEngineer;

let testArray = [];

const addNumber = 5000;
let iteration = 0;


while (iteration < addNumber) {
    testArray = addEngineer(testArray);
    iteration++;
}


describe('addEngineer', function () {


    console.log('testArray', testArray);

    it('should be an array', function () {
        assert.typeOf(testArray, 'array');
    })

    it('all elements should be ints', function () {
        for (let j = 0; j < testArray.length; j++) {
            assert.typeOf(testArray[j], 'number')
        }
    })


    //only one shift a day
    it('each engineer should only complete one shift a day', function () {
        for (let i = 0; i < testArray.length; i = i + 2) {
            dayArray = testArray.slice(i, i + 2)
            assert.notEqual(dayArray[0], dayArray[1]);
        }

    });
    //no shift on consecutive days
    it('each engineer should have no shift on consecutive days', function () {
        for (let i = 0; i < testArray.length; i = i + 2) {
            dayArray = testArray.slice(i, i + 2);
            nextDayArray = testArray.slice(i + 2, i + 4);
            assert.notInclude(dayArray, nextDayArray[0]);
            assert.notInclude(dayArray, nextDayArray[1]);
        }
    });

    //one day over two week period
    it('each engineer should only complete one day (2 shifts) in a 2 week period', function () {
        let highestCount = 0;
        for (let k = 0; k < testArray.length; k = k + 10) {
            let twoWeekPeriod = testArray.slice(k, k + 20);
            for (let m = 0; m < twoWeekPeriod.length; m++) {
                let count = 0;
                for (let l = m; l < twoWeekPeriod.length; l++) {
                    if (twoWeekPeriod[k] === twoWeekPeriod[l]) {
                        count++
                    }
                }
                if (count > highestCount) {
                    highestCount = count;
                }
            }



        }
        assert.isBelow(highestCount, 3, 'none with three shifts')

    })

});
