let client = require('./dbConnection');

let collection = client.db('screenWise').collection('child');

// Function to add Child record
async function postChild(child, callback) {
    try {
        // First check if child already exists so that error message can be displayed
        const existingChild = await collection.findOne({ childNameText: { $eq: child.childNameText}}); 
        if(existingChild) {
            response = "Child " + child.childName + " already exists.";  
            return callback(null, response, 409);
        } else {
            const insertedRow = await collection.insertOne(child);
            response = 'Child record ' + child.childName + ' added. ';
            return callback(null, response, 201);
        };
    } catch (err) {
        return callback(err);
    };
};

// Function to list all children
async function listChild(callback) {
    try { 
        const listValues = await collection.find({}, { projection: {childName: 1, dailyAllowancePoints: 1, minutesPerPoint: 1, dailyLimitPoints: 1 } })
            .sort({ childName: 1 })
            .toArray();
        if(listValues) {
            return callback(null, listValues, 201);
        } else {
            return callback(null, 'No child values found', 404);
        }
    } catch (err) {
        return callback(err);
    };
};


// Function to get a child by name
async function getChild(childName, callback) {
    try {
        const child = await collection.findOne({ childName: childName });
        if (child) {
            return callback(null, child, 200);
        } else {
            return callback(null, "Child not found", 404);
        }
    } catch (err) {
        return callback(err);
    }
};

///////////////////////////////////
let { ObjectId } = require('mongodb');


// Function to list all child records
async function listChildList(callback) {
    try {
        const childList = await collection.find({}).toArray();
        return callback(null, childList, 200);
    } catch (err) {
        return callback(err);
    }
}

// Function to update a child record
async function updateChild(childId, updatedData, callback) {
    try {
        const result = await collection.updateOne({ _id: new ObjectId(childId) }, { $set: updatedData });
        if (result.matchedCount > 0) {
            return callback(null, {
                "message": "Child record updated",
                "childId": childId
            }, 200);
        } else {
            return callback(null, {
                "message": "Child not found"
            }, 404);
        }
    } catch (err) {
        return callback(err);
    }
}

// Function to delete a child record
async function deleteChild(childId, callback) {
    try {
        const result = await collection.deleteOne({ _id: new ObjectId(childId) });
        if (result.deletedCount > 0) {
            return callback(null, {
                message: "Child record deleted",
                childId: childId
            }, 200);
        } else {
            return callback(null, "Child not found", 404);
        }
    } catch (err) {
        console.log(err);
        return callback(err);
    }
}



// Exporting the functions
module.exports = {
    postChild,
    getChild,
    listChild,
    //////
    listChildList,
    updateChild,
    deleteChild,
};