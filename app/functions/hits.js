exports = async function({ response }) {
    try {
        // Access the MongoDB collection
        const collection = context.services.get("mongodb-atlas").db("starwars").collection("timeseries");

        // Define the aggregation pipeline
        const pipeline = [
            { '$match': { 'swosh': true } },
            { '$count': 'numberOfHits' }
        ];

        // Execute the aggregation pipeline
        const result = await collection.aggregate(pipeline).toArray();

        // Return the result or a default message if no documents are found
        if (result.length === 0) {
            return { numberOfHits: 0 };
        } else {
            return result[0];
        }
    } catch (error) {
        console.error("Aggregation Error:", error);
        response.setStatusCode(500); // Internal Server Error
        return { "error": "Error executing aggregation", "details": error.message };
    }
};
