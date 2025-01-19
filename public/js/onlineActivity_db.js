let client = require('./dbConnection');

let collection = client.db('screenWise').collection('onlineActivities');

async function postOnlineActivity(activity, callback) {
    try {
        // First check if record already exists so that error message can be displayed
        const existingActivity = await collection.findOne({ onlineActivityNameText: { $eq: activity.onlineActivityNameText}}); 
        if(existingActivity) {
            response = "Activity " + activity.onlineActivityNameText + " already exists.";  
            return callback(null, response, 409);

        } else {
            const insertedRow = await collection.insertOne(activity);
            response = 'Online Activity ' + activity.onlineActivityName + ' added. ';
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    } 
};


// Function to list all offline activities
async function listOnlineActivity(callback) {
    try { 
        const listValues = await collection.find({}, { projection: {onlineActivityName: 1, pointsPerHour: 1 } })
            .sort({ onlineActivityName: 1 })
            .toArray();
        if(listValues) {
            return callback(null, listValues, 201);
        } else {
            return callback(null, 'No online activity values values found', 404);
        }
    } catch (err) {
        return callback(err);
    };
};

// Need to add getOnlineActivity, updateOnlineActivity and deleteOnlineActivity


module.exports = {
    postOnlineActivity,
    listOnlineActivity
};