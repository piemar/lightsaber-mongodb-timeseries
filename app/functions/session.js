exports =  function({ query, headers, body}, response){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  const queryPredicate={ "email": query.email}
    results = context.services.get("mongodb-atlas").db("starwars").collection("timeseries").find(queryPredicate).toArray();

  return results;
};