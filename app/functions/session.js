exports = async function({ query, response }) {
    // Validate the presence of the email query
    if (!query || !query.email) {
        response.setStatusCode(400); // Bad Request
        return { "error": "Email query parameter is missing" };
    }

    try {
        // Access the MongoDB collection
        const collection = context.services.get("mongodb-atlas").db("starwars").collection("timeseries");

        // Define the query predicate
        const queryPredicate = { "email": query.email };

        // Execute the find operation
        const result = await collection.find(queryPredicate).toArray();

        // Check if any documents were found
        if (result.length === 0) {
            return { "message": "No documents found for the provided email" };
        } else {
            return result;
        }
    } catch (error) {
        console.error("Database query error:", error);
        response.setStatusCode(500); // Internal Server Error
        return { "error": "Error executing database query", "details": error.message };
    }
};
