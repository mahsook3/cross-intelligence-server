import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { getEmbeddings } from './get-embeddings.js';

dotenv.config();
const uri = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(uri);

const database = client.db("cross-intelligence");
const coll = database.collection("duty-drawback");

async function updateDocuments() {
    try {
        console.log("Connecting to the database...");
        await client.connect();
        console.log("Connected to the database.");

        let processedCount = 0;

        while (true) {
            const doc = await coll.findOne({ embedding: { $exists: false } });
            if (!doc) break;

            console.log(`Processing document with _id: ${doc._id}`);

            const embedding = await getEmbeddings(doc.description_of_goods);
            await coll.updateOne(
                { _id: doc._id },
                { $set: { embedding } }
            );

            processedCount++;
            console.log(`Processed ${processedCount} documents so far.`);

            const remainingCount = await coll.countDocuments({ embedding: { $exists: false } });
            console.log(`Remaining documents without embedding: ${remainingCount}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        console.log("Closing the database connection...");
        await client.close();
        console.log("Database connection closed.");
    }
}

updateDocuments().catch(console.error);