const { MongoClient } = require("mongodb");
const fs = require("fs");
const Papa = require("papaparse");

// MongoDB connection parameters
const mongoURL = "mongodb+srv://f20200278:TRSABCGG@cluster0.xm5tetj.mongodb.net/Node-API?retryWrites=true&w=majority";
const dbName = "Node-API";
const collectionName = "products";

// Connect to MongoDB and perform the query
async function queryAndConvertToCSV() {
  try {
    const client = await MongoClient.connect(mongoURL);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Perform the MongoDB query to retrieve the data
    // const query = {}; // Replace with your specific query, if needed
    const cursor = collection.find();
    //console.log("cursor4", cursor);

    const results = await cursor.toArray();
    client.close();
    console.log("results", results);

    // Convert JSON data to CSV format using Papa Parse
    const csv = Papa.unparse(results);

    // Write the CSV data to a file named 'output.csv'
    fs.writeFileSync("products.csv", csv);

    console.log("CSV file created successfully!");
  } catch (err) {
    console.error("Error:", err);
  }
}

// Call the function to run the process
queryAndConvertToCSV();
