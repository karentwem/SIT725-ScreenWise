let client = require('./dbConnection');

let collection = client.db('screenWise').collection('logOfflineActivities');

async function postLogOfflineActivity(activity, callback) {
    try {
        const insertedRow = await collection.insertOne(activity);
        response = 'Log Offline Activity ' + activity.offlineActivityName + ' for ' + activity.childName + ' submitted.';
            return callback(null, response, 201);
    } catch (err) {
        return callback(err);
    } 
};

module.exports = {
    postLogOfflineActivity
};