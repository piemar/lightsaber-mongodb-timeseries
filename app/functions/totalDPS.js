exports = async function({ response }) {
    try {
        // Access the MongoDB collection
        const collection = context.services.get("mongodb-atlas").db("starwars").collection("timeseries");

        // Define the aggregation pipeline
        const pipeline = [
  {
    $match: {
      swosh: true,
    },
  },
  {
    $group: {
      _id: {
        time: {
          $dateTrunc: {
            date: "$timestamp",
            unit: "second",
            binSize: 1,
          },
        },
      },
      dps: {
        $count: {},
      },
    },
  },
  {
    $project: {
      date: "$_id.time",
      dps: 1,
      _id: 0,
    },
  },
  {
    $setWindowFields: {
      sortBy: {
        date: 1,
      },
      output: {
        AvgDps10: {
          $avg: "$dps",
          window: {
            range: [-10, 0],
            unit: "second",
          },
        },
        AvgDps100: {
          $avg: "$dps",
          window: {
            range: [-100, 0],
            unit: "second",
          },
        },
      },
    },
  },
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
