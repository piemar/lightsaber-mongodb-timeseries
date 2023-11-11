exports = function({ query, headers, body}, response) {

    if(!query){
      return({"error" : "No search query present"})
    }
    // Querying a mongodb service:
    return context.services.get("mongodb-atlas").db("starwars").collection("timeseries").aggregate(
[
  {
    $group:
      /**
       * _id: The id of the group.
       * fieldN: The first field name.
       */
      {
        _id: "$deviceInfo.deviceType",
        value: {
          $count: {},
        },
      },
  },
  {
    $sort:
      /**
       * Provide any number of field/order pairs.
       */
      {
        value: -1,
      },
  },
  {
    $limit:
      /**
       * Provide the number of documents to limit.
       */
      10,
  },
  {
    $project: {
      id: "$_id",
      label: "$_id",
      value: 1,
      _id: 0,
    },
  },
]);
};