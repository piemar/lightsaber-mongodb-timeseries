exports = async function({ response }) {
    try {
        // Access the MongoDB collection
        const collection = context.services.get("mongodb-atlas").db("starwars").collection("timeseries");

        // Define the aggregation pipeline
        const pipeline = [
            { $match: { swosh: true } },
            { 
                $group: {
                    _id: "$email",
                    value: { $count: {} }
                }
            },
            { $sort: { value: -1 } },
            { $limit: 10 },
            { 
                $project: {
                    id: "$_id",
                    label: "$_id",
                    value: 1,
                    _id: 0
                }
            }
        ];

        // Execute the aggregation pipeline
        const result = await collection.aggregate(pipeline).toArray();

        // Return the result
        return result;
    } catch (error) {
        console.error("Aggregation Error:", error);
        response.setStatusCode(500); // Internal Server Error
        return { "error": "Error executing aggregation", "details": error.message };
    }
};
