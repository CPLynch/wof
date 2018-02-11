var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var addEngineer = require('./addEngineer').addEngineer;


function getShiftsFromFile() {
    let data = fs.readFileSync('./shifts.json', 'utf-8');
    return JSON.parse(data);
}


function writeShiftsToFile(shiftArray, callback) {
    jsonToSave = JSON.stringify(shiftArray);
    fs.writeFile('./shifts.json', jsonToSave, callback);
}


app.use(express.static('Public'))
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/Public/html.html', function (err) {
        if (err) {
            console.log('There was an error: ' + err)
        }
    });
});


app.get('/existingShifts', function (req, res) {
    let shifts = getShiftsFromFile();
    res.send(JSON.stringify(shifts));
})

app.post('/newShiftsForDay', function (req, res) {
    let shifts = getShiftsFromFile();    let shifts = getShiftsFromFile();

    for (var i = 0; i < 2000; i++) {
        shifts = addEngineer(shifts);
    }
    writeShiftsToFile(shifts, function (err) {
        if (err) {
            console.error(err);
            res.status(500).send('Did not save');
        }
        res.sendFile(__dirname + '/shifts.json');
    });
})

app.delete('/deleteExistingShifts', function (req, res) {
    res.send('deleted')
})

app.listen(3000, function () {
    console.log('app running on port 3000')
});
