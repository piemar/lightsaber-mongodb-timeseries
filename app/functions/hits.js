exports = function({ query, headers, body}, response) {

    if(!query){
      return({"error" : "No search query present"})
    }
    // Querying a mongodb service:
    return context.services.get("mongodb-atlas").db("starwars").collection("timeseries").aggregate(
      [
        {
          '$match': {
            'swosh': true
          }
        }, {
          '$count': 'numberOfHits'
        }
      ]);
};