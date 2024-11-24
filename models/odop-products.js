import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(uri);

const database = client.db("cross-intelligence");
const coll = database.collection("odop-products");

export async function ODOPdetails(state, district) {
    console.log('state:', state, 'district:', district);
    try {
        await client.connect();
        const query = {};
        if (state) query.State = state;
        if (district) query.District = district;
        const projection = { _id: 0, State: 1, District: 1, Product: 1 };
        const results = await coll.find(query).project(projection).toArray();
        return results;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await client.close();
    }
}