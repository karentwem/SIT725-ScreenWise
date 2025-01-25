let client = require('./dbConnection');
let collection = client.db('screenWise').collection('child');
let { ObjectId } = require('mongodb');

async function getChildData(id, callback) {
    try {
        // Validate the ID
        if (!ObjectId.isValid(id)) {
            return callback(null, {
                "message": "Invalid ID format"
            }, 400);
        }

        // Query the database to find the child by ID
        const child = await collection.findOne({ _id: new ObjectId(id) });

        if (child) {
            return callback(null, {
                "message": "Child data retrieved successfully",
                "data": child,
            }, 200);
        } else {
            return callback(null, {
                "message": "Child not found"
            }, 404);
        }
    } catch (err) {
        console.error('Error fetching child data:', err);
        return callback(err);
    }
}

module.exports = {
    getChildData
};
