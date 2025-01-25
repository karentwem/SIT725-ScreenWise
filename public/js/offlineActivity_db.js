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

//////////////////////////
let { ObjectId } = require('mongodb');

// Function to delete offline activity
async function deleteOfflineActivity(id, callback) {
    try {
        const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (deleteResult.deletedCount > 0) {
            return callback(null, {
                "message": "Activity deleted successfully",
            }, 200);
        } else {
            return callback(null, {
                "message": "Activity not found"
            }, 404);
        }
    } catch (err) {
        return callback(err);
    }
}


// Function to update offline activity
async function updateOfflineActivity(id, updatedActivity, callback) {
    try {
        const updateResult = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedActivity }
        );
        
        if (updateResult.matchedCount > 0) {
            return callback(null, {
                "message": "Activity updated successfully"
            }, 200);
        } else {
            return callback(null, {
                "message": "Activity not found"
            }, 404);
        }
    } catch (err) {
        return callback(err);
    }
}



module.exports = {
    postOfflineActivity,
    listOfflineActivity,
    deleteOfflineActivity,
    updateOfflineActivity
};