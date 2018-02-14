const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const addEngineer = require('./addEngineer').addEngineer;
const config = require('./config');


function getShiftsFromJson() {
    try {
        let data = fs.readFileSync('./shifts.json', 'utf-8'); //using Sync as few (likely one) user(s) as it is a single company, and stops small risk of two requests having race condition.
        return JSON.parse(data);
    } catch (e) {
        console.error(e);
        return null;
    }
}


function writeShiftsToJson(shiftArray) {
    jsonToSave = JSON.stringify(shiftArray);
    fs.writeFileSync('./shifts.json', jsonToSave);
}


app.use(express.static('Public'))


app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Public/wheel.html', function (err) {
        if (err) {
            console.log('There was an error: ' + err)
        }
    });
});


app.get('/shifts', function (req, res) {
    let shifts = getShiftsFromJson();
    if (null === shifts) {
        res.status(404).send('Couldn\'t get shifts');
    }
    try {
        if (req.query.offset) {
            shifts.splice(0, req.query.offset * 2);
        }
        if (req.query.limit) {
            shifts.splice(req.query.limit * 2)
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    const returnData = {
        config : config,
        data : shifts
    }
    res.set('Content-Type', 'application/json').send(JSON.stringify(returnData));
});


//using put not post as not creating anything new just modifying
app.put('/shifts', function (req, res) {
    let shifts = getShiftsFromJson();
    if (null === shifts) {
        res.status(404).send('Couldn\'t get shifts');
    }
    // needs to add for full day so called twice.
    shifts = addEngineer(shifts);
    shifts = addEngineer(shifts);
    try {
        writeShiftsToJson(shifts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Couldn\'t save new shifts');
    }
    const returnData = {
        config : config,
        data : shifts.slice(-2)
    }
    res.set('Content-Type', 'application/json').send(JSON.stringify(returnData));
});


app.delete('/shifts', function (req, res) {
    try {
        const shifts = [];
        writeShiftsToJson(shifts);
    } catch (err) {
        console.error(err);
        res.status(500).send('Couldn\'t delete shifts');
    }
    res.send();
});


app.listen(process.env.PORT || 3000, function () {
    console.log('app running on port 3000');
});
