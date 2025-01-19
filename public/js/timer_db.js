let client = require('./dbConnection');

let collection = client.db('screenWise').collection('timer');


// Function to start the timer
async function startTimer(timer, callback) {
    try {
        // Insert timer record
        const insertedRow = await collection.insertOne(timer);
        minsUsedRounded = Math.round(timer.minsUsed);
        pointsUsedFixed = timer.pointsUsed.toFixed(2);
        if(minsUsedRounded==1) { minsUsedText=' minute '} else { minsUsedText=' minutes '};
        if(pointsUsedFixed==1.00) {pointsUsedText=' point'} else { pointsUsedText=' points'};
        response = 'Timer stopped at ' + timer.endDateTime + '.\n ' + Math.round(timer.minsUsed) + minsUsedText + ' (' + timer.pointsUsed.toFixed(2) + pointsUsedText + ') used.';
        return callback(null, response, 201);
        
   } catch (err) {
       return callback(err);
   };
};


// Exporting the functions
module.exports = {
    startTimer
};