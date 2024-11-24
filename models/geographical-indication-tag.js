import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(uri);

const database = client.db("cross-intelligence");
const coll = database.collection("geographical-indication-tag");

export async function getGeographicalIndicationByState(state) {
    console.log('state:', state);
    try {
        await client.connect();
        const query = { State: state };
        const projection = { _id: 0, ApplicationNo: 1, GeographicalIndications: 1, Goods: 1, State: 1 };
        const results = await coll.find(query).project(projection).toArray();
        return results;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await client.close();
    }
}