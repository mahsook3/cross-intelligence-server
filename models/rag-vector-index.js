import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING_creation);

async function run() {
    try {
      const database = client.db("cross-intelligence");
      const collection = database.collection("duty-drawback");
     
      const index = {
          name: "vector_index",
          type: "vectorSearch",
          definition: {
            "fields": [
              {
                "type": "vector",
                "numDimensions": 768,
                "path": "embedding",
                "similarity": "cosine"
              }
            ]
          }
      }
 
      const result = await collection.createSearchIndex(index);
      console.log(result);
    } finally {
      await client.close();
    }
}
run().catch(console.dir);
