// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
    // Data can be extracted from the request as follows:

    // Query params, e.g. '?arg1=hello&arg2=world' => {arg1: "hello", arg2: "world"}
    const {arg1, arg2} = query;

    // Headers, e.g. {"Content-Type": ["application/json"]}
    const contentTypes = headers["Content-Type"];

    // Raw request body (if the client sent one).
    // This is a binary object that can be accessed as a string using .text()
    const reqBody = body;
    const payload = JSON.parse(reqBody.text());
    payload.timestamp=new Date(Date.now());
    const hint=context.services.get("mongodb-atlas").db("starwars").collection("timeseries").insertOne(payload);

    response.setStatusCode(200);
    response.setBody(`Successfully saved "someField" with _id:`);
    return { msg: "finished!" };
};
