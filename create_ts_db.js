// Create Timeseries collection to be used to store device sensor data.
db=db.getSiblingDB("starwars")
// Create a MongoDB TimeSeries collection, that will store all the hints.
db.createCollection(
    "timeseries",
    {
       timeseries: {
          timeField: "timestamp",
          metaField: "email",
          granularity: "seconds"
       }
    }
)