// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
    // Data can be extracted from the request as follows:

    collection=context.services.get("mongodb-atlas").db("starwars").collection("timeseries");
    const search_results=collection.find(
        {
          "email": query.email
          }
        ).toArray();
        
    const results = search_results
    return results[0]        
};
