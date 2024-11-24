import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.ATLAS_CONNECTION_STRING_testa;
const client = new MongoClient(uri);

const database = client.db("cross-intelligence");
const coll = database.collection("RoDTEP");

export async function getRoDTEPDataByHSN(hsnCode) {
    try {
        await client.connect();
        const query = { HSN: isNaN(hsnCode) ? hsnCode : Number(hsnCode) };
        console.log("Query:", query);
        const result = await coll.findOne(query);
        console.log("Result:", result);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await client.close();
    }
}