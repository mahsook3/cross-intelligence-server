import { MongoClient } from "mongodb";
import { getEmbeddings } from "./get-embeddings.js";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.ATLAS_CONNECTION_STRING_creation;
const client = new MongoClient(uri);

async function connectClient() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
}

export async function dutyDrawback(query) {
    try {
        await connectClient();

        const database = client.db("cross-intelligence");
        const coll = database.collection("duty-drawback");

        const agg = [
            {
              '$vectorSearch': {
                'index': 'vector_index',
                'path': 'embedding',
                'queryVector': await getEmbeddings(query),
                'numCandidates': 150,
                'limit': 3
              }
            }, {
              '$project': {
                tariff_item : 1,
                drawback_rate : 1,
                drawback_cap_per_unit : 1,
                Unit : 1,
                description_of_goods : 1,
                'score': {
                  '$meta': 'vectorSearchScore'
                }
              }
            }
          ];

        const result = coll.aggregate(agg);
        const documents = [];
        await result.forEach((doc) => documents.push(doc));
        return documents;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    } finally {
    }
}

process.on('SIGINT', async () => {
    await client.close();
    process.exit(0);
});