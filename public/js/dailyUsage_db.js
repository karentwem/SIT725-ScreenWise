let client = require('./dbConnection');

let collection = client.db('screenWise').collection('dailyUsage');


// Function to update points balance after screen time usage
async function postDailyUsage(dailyUsage, callback) {
    try {
        // Check if 
        const existingDailyUsage = await collection.findOne({ 
            childNameText: { $eq: dailyUsage.childNameText},
            startDate: { $eq: dailyUsage.startDate}
        }); 
        if(existingDailyUsage) {
            // Can only earn points up to the maximimum daily limit
            let maxEarnt = parseFloat(existingDailyUsage.pointsLimit) - existingDailyUsage.pointsUsed - existingDailyUsage.pointsAvailable;
            if(parseFloat(dailyUsage.pointsEarnt) < maxEarnt) {
                maxEarnt = dailyUsage.pointsEarnt;
            };
            // Reduce by points used or increment by points earnt (with max limit)
            const pointsIncrement = (-1 * dailyUsage.pointsUsed) + maxEarnt;
            const update = { 
                $inc: {
                    //Increment points used
                    pointsUsed: dailyUsage.pointsUsed,
                    //Increment minutes used
                    minsUsed: dailyUsage.minsUsed,
                    //Increment points earnt
                    pointsEarnt: dailyUsage.pointsEarnt,
                    //Reduce or increase points available
                    pointsAvailable: pointsIncrement,
                }
            }; 
            const result = await collection.updateOne({ _id: existingDailyUsage._id }, update);
            response = "Points balance updated for " + dailyUsage.childName + '.';  
            return callback(null, response, 201);
        } else {
            // Create new daily usage
            const insertedRow = await collection.insertOne(dailyUsage);
            response = "Points balanced updated for " + dailyUsage.childName + '.';  
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    };
};


// Function to get daily usage record
async function getDailyUsage(req, callback) {

    const { childNameText, startDate } = req.query;
    try {
        // Check if daily usage record exists
        const existingDailyUsage = await collection.findOne({ 
            childNameText: { $eq: childNameText},
            startDate: { $eq: startDate}
        }); 
        
        if(existingDailyUsage) {
            // Return points available today
            const response = existingDailyUsage.pointsAvailable;
            if(response<=0) {
                return callback(null, 0, 201);
            } else {
                return callback(null, response, 201);
            }
   
        } else {
            // Return null
            return callback(null, null, 201);
        };
    } catch (err) {
        return callback(err);
    };
};



// Exporting the functions
module.exports = {
    postDailyUsage,
    getDailyUsage
};