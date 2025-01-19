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


// Function to get a child by name - placeholder, doesn't work
function getChild(childName, res) {
    collection.findOne({ childName: childName }, res);
}


 
// Function to update a child record - placeholder, doesn't work
function updateChild(childName, updatedData, res) {
    collection.updateOne({ childName: childName }, { $set: updatedData }, res);
}

// Function to delete a child record - placeholder, doesn't work
function deleteChild(childName, res) {
    collection.deleteOne({ childName: childName }, res);
}

// Exporting the functions
module.exports = {
    postChild,
    getChild,
    listChild,
    updateChild,
    deleteChild
};