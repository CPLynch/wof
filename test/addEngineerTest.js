const assert = require('chai').assert;
const addEngineer = require('../addEngineer').addEngineer;

var testArray = [];

var addNumber = 10000;
var iteration = 0;

while (iteration < addNumber) {
    testArray = addEngineer(testArray);
    iteration++;
}



describe('cleanFile', function () {

    
    console.log('testArray', testArray);

    it('should be an array', function () {
        assert.typeOf(testArray, 'array');
    })
    
    it('all elements should be ints', function(){
      for (var j = 0; j < testArray.length; j++ ) {
          assert.typeOf(testArray[j],'number')
      }
    }) 


    //only one shift a day
    it('each engineer should only complete one shift a day', function () {
        for (var i = 0; i < testArray.length; i = i + 2) {
            dayArray = testArray.slice(i, i + 2)
            assert.notEqual(dayArray[0], dayArray[1]);
        }

    });
    //no shift on consecutive days
    it('each engineer should have no shift on consecutive days', function () {
        for (var i = 0; i < testArray.length; i = i + 2) {
            dayArray = testArray.slice(i, i + 2);
            nextDayArray = testArray.slice(i + 2, i + 4);
            assert.notInclude(dayArray, nextDayArray[0]);
            assert.notInclude(dayArray, nextDayArray[1]);
        }
    });

    //one day over two week period
    it('each engineer should only complete one day (2 shifts) in a 2 week period', function () {
        let highestCount = 0;
        last2weekPeriod = testArray.slice(-((testArray.length % 10) + 10))
        for (var k = 0; k < last2weekPeriod.length; k++) {
            var count = 0;
            for (var l = k; l < last2weekPeriod.length; l++) {
                if (last2weekPeriod[k] === last2weekPeriod[l]) {
                    count++
                }
            }
            if (count > highestCount) {
                highestCount = count;
            }
        }
        assert.isAbove(3, highestCount, 'none with three shifts')

    })

});
