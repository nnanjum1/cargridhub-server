const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const cors = require('cors')

const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv')
dotenv.config()

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db("cargridhub")
        const carCollection = db.collection("cars")

        app.post("/cars", async (req, res) => {
            const carData = req.body;
            const result = await carCollection.insertOne(carData)

            res.json(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    console.log("server is ok")
})

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})