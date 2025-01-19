let client = require('./dbConnection');

let collection = client.db('screenWise').collection('offlineActivities');

async function postOfflineActivity(activity, callback) {
    try {
        // First check if record already exists so that error message can be displayed
        const existingActivity = await collection.findOne({ offlineActivityNameText: { $eq: activity.offlineActivityNameText}}); 
        if(existingActivity) {
            response = "Activity " + activity.offlineActivityName + " already exists.";  
            return callback(null, response, 409);

        } else {
            const insertedRow = await collection.insertOne(activity);
            response = 'Offline Activity ' + activity.offlineActivityName + ' added. ';
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    } 
};

// Function to list all offline activities
async function listOfflineActivity(callback) {
    try { 
        const listValues = await collection.find({}, { projection: {offlineActivityName: 1, pointsPerHour: 1 } })
            .sort({ offlineActivityName: 1 })
            .toArray();
        if(listValues) {
            return callback(null, listValues, 201);
        } else {
            return callback(null, 'No offline activity values values found', 404);
        }
    } catch (err) {
        return callback(err);
    };
};

// Need to add getOfflineActivity, updateOfflineActivity and deleteOfflineActivity

module.exports = {
    postOfflineActivity,
    listOfflineActivity
};