import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb+srv://Anna-Mariia:1234@project1.ltuadeq.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export const initializeDbConnection = async () => {
    // client = await MongoClient.connect('mongodb://localhost:27017');

    await client.connect();
}
export const getDbConnection = dbName => {
    const db = client.db(dbName);
    return db;
}