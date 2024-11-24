import { MongoClient } from "mongodb";
import { getEmbeddings } from "./get-embeddings.js";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(uri);

export async function harmonisationOfScheduleII(query) {
    try {
        await client.connect();

        const database = client.db("cross-intelligence");
        const coll = database.collection("harmonisation-of-schedule-II");

        const agg = [
            {
              '$vectorSearch': {
                'index': 'vector_index',
                'path': 'embedding',
                'queryVector': await getEmbeddings(query),
                'numCandidates': 150,
                'limit': 10
              }
            }, {
              '$project': {
                document: 1,
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
    } finally {
        await client.close();
    }
}