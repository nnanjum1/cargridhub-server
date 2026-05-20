const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.get("/cars", async (req, res) => {
            const result = await carCollection.find().toArray()
            res.json(result)
        })

        app.post("/cars", async (req, res) => {
            const carData = req.body;

            const newCar = {
                ...carData,
                booking_count: 0,
                createdAt: new Date()
            };
            const result = await carCollection.insertOne(newCar)

            res.json(result)
        })

        app.get("/cars/:id", async (req, res) => {
            const { id } = req.params
            const result = await carCollection.findOne({ _id: new ObjectId(id) })

            res.json(result)
        })

        app.patch("/cars/book/:id", async (req, res) => {
            try {
                const { id } = req.params;

                const result = await carCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $inc: { booking_count: 1 }
                    }
                );

                res.json(result);
            } catch (error) {
                res.status(500).json({ message: "Booking failed", error });
            }
        });


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