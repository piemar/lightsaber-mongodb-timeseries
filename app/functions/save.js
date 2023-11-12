// This function is the endpoint's request handler for storing data in a MongoDB collection.
exports = async function({ body }, response) {
    try {
        // Parse the request body
        const payload = JSON.parse(body.text());
        // Add a timestamp to the payload
        payload.timestamp = new Date();

        // Get the MongoDB collection
        const db = context.services.get("mongodb-atlas").db("starwars");
        const collection = db.collection("timeseries");

        // Insert the payload into the collection
        await collection.insertOne(payload);

        // Send a success response
        response.setStatusCode(200);
        response.setBody(JSON.stringify({ msg: "Data stored successfully!" }));
    } catch (error) {
        // Handle any errors that might occur
        console.error("Error in endpoint handler:", error);
        response.setStatusCode(500);
        response.setBody(JSON.stringify({ msg: "Error storing data", error: error.message }));
    }
};
